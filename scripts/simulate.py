import sys
import os
import argparse



import sgs_preprocess
import sgs_alg
import sgs_plts

import numpy as np
import pandas as pd
from pathlib import Path
import sqlite3

import multiprocessing
import signal
import time

from datetime import datetime

def logPrint(message):
    print(f"{datetime.now()} | {message}")
# Custom exception for handling signal interruption
class SimulationInterrupted(Exception):
    pass

# Signal handler function
def signal_handler(signum, frame):
    raise SimulationInterrupted

def monitor_status(guid,rid, main_process_pid, dbfile):
    while True:
        status = getRealizationStatus(guid,rid, dbfile)
        if status == 'CANCELLED':
            os.kill(main_process_pid, signal.SIGUSR1)
            break
        elif status in ['COMPLETE', 'ERROR']:
            break  # Exit the process if the realization is complete
        time.sleep(10)

def plt_graph(sim, df_bed, res, x, y, z, filename,xmin,xmax,ymin,ymax):

    # 2D hillshade topographic plot
    title = f'Bed Elevation Model'

    mu = np.mean(sim[z]); sd = np.std(sim[z])
    vmin = mu - 3*sd ; vmax = mu + 3*sd

    #xmin = np.min(df_bed[x]); xmax = np.max(df_bed[x])
    #ymin = np.min(df_bed[y]); ymax = np.max(df_bed[y])

    grid_xy, rows, cols = sgs_plts.prediction_grid(xmin, xmax, ymin, ymax, res)
    
    plot_i = sgs_plts.mplot(grid_xy, sim[[z]].to_numpy(), rows, cols, title, vmin = vmin, vmax = vmax, hillshade=True)
    plot_i.savefig(filename, bbox_inches = 'tight')
    


def updateRealizationRecord(guid: str, rid: int , status: str, dbfile: str):
    
    SQL = "UPDATE realization_statuses SET status = ?, last_update = CURRENT_TIMESTAMP WHERE guid = ? AND rid = ?"
    with sqlite3.connect(dbfile) as conn:
        cursor = conn.cursor()
        cursor.execute(SQL,(status,guid,rid))
        conn.commit()

def getRealizationStatus(guid: str, rid: int , dbfile: str):
    
    SQL = "select status from realization_statuses WHERE guid = ? AND rid = ?"
    with sqlite3.connect(dbfile) as conn:
        cursor = conn.cursor()
        record = cursor.execute(SQL,(guid,rid)).fetchone()
        if record is None:
            return "No record found"
        return record[0]


def simulate(xmin: float, xmax: float, ymin: float, ymax : float, res: int, num_realizations: int, guid: str, datafile: str, output_dir: str, num_cpus: int, dbfile: str):
    """
    Performs Sequential Gaussian co-simulation (Co-SGS) on a section of Greenland topography.

    Parameters:
    -----------
    xmin : float
        The minimum x-coordinate of the section of interest.

    xmax : float
        The maximum x-coordinate of the section of interest.

    ymin : float
        The minimum y-coordinate of the section of interest.

    ymax : float
        The maximum y-coordinate of the section of interest.

    res : int
        The resolution for the simulation, indicating the grid spacing or step size.

    num_realizations : int
        The number of simulations to be run.

    datafile : str
        Datafile to use for the simulation
        
    output_dir : str 
        Absolute path for ouput directory
        
    
    Returns:
    --------
    TODO
    """
    
    try:  
        for i in range(num_realizations):
            updateRealizationRecord(guid,i,'PENDING',dbfile) # Set all realizations to pending. 

        #xmin = None; xmax = None; ymin = None ; ymax = None ## Plot entire datafile TODO: Remove when done testing
        x = "X"; y = "Y"; z = "BED" # Column headings in CSV data files

        # read data from input file
        df_bed = pd.read_csv(datafile)

        # grid data
        df_data, grid_matrix, df_nan = sgs_preprocess.grid_data(df_bed, xmin, xmax, ymin, ymax, res, x, y, z)

        # normal score transformation of bed elevation
        df_data.loc[:,'Norm_Bed'], nst_trans = sgs_preprocess.nscore(df_data, z)

        # adaptive clustering
        max_pts = 100           # maximum number of points in each cluster
        min_len = 50000         # minimum side length of squares
        df_data, i = sgs_preprocess.adaptive_partitioning(df_data, xmin, xmax, ymin, ymax, max_pts, min_len)

        # get number of processes to use
        if num_cpus is None:
            logPrint("No CPU count was specified, program will run on all cores available.")
            processes = int(os.cpu_count())
        else: 
            processes = num_cpus

        # get variograms for each cluster in parallel
        max_lag = 30000         # maximum lag distance
        n_lags = 100            # number of bins
        gamma = sgs_preprocess.get_variograms(df_data, n_lags, max_lag, processes)

        
    except Exception as e:
        logPrint(f"Ran into error: {e} while gridding data and getting variogreams")
        for i in range(num_realizations):
            updateRealizationRecord(guid,i,'ERROR',dbfile) # Set all realizations to ERROR. 
        raise e
    
    for i in range(num_realizations):
        
        # Start monitoring process
        monitor_process = multiprocessing.Process(target=monitor_status, args=(guid,i, os.getpid(), dbfile))
        
        
        try:
            monitor_process.start()
            if getRealizationStatus(guid,i,dbfile) in ['CANCELLED']:
                logPrint(f"Realization {guid}/{i} has been marked as cancelled, skipping it...")
                continue
            

            
            
            logPrint(f'-----------------------------------------')
            logPrint(f'\tStarting Realization #{i+1}\n')
            updateRealizationRecord(guid,i,'RUNNING',dbfile)


            # shuffle df of points to simulate (random path)
            df_nan = sgs_preprocess.shuffle_pred_grid(df_nan)

            # get kriging weights in parallel
            max_num_nn = 50     # maximum number of nearest neighbors
            rad = 30000         # search radius
            kr_dictionary = sgs_alg.kriging_weights(df_data, df_nan, gamma, rad, max_num_nn, res, processes, x, y, 'Norm_Bed', 'cluster')

            # sequential gausian simulation
            data_xyzk, pred_xyzk = sgs_alg.sgs_pred_Z(kr_dictionary, df_data, df_nan, gamma, x, y, 'Norm_Bed', 'cluster')

            # concatenate data frames
            df_sim = sgs_alg.concat(data_xyzk, pred_xyzk)

            #reverse normal score transformation
            tmp = df_sim['Norm_Bed'].values.reshape(-1,1)
            df_sim[z] = nst_trans.inverse_transform(tmp)

            # save dataframe to csv
            csv_path = Path(f'{output_dir}/{guid}/{i}/sim.csv')
            csv_path.parent.mkdir(parents=True, exist_ok=True)
            logPrint(f"Storing CSV in file {csv_path}")
            df_sim.to_csv(csv_path, index=False)

            # output graph
            plot_path = Path(f'{output_dir}/{guid}/{i}/plot.png')
            #sgs_plts.plt_graph(df_sim, df_bed, res, x, y, z, i)
            try:
                logPrint(f"Storing PNG in file {plot_path}")
                plt_graph(df_sim, df_bed, res, x, y, z, plot_path,xmin,xmax,ymin,ymax)
            except Exception as e: 
                logPrint(f"### Problem creating graph {e} !!! ")
                raise e
                
            updateRealizationRecord(guid,i,'COMPLETE',dbfile)
        except SimulationInterrupted:
            logPrint(f"Realization {i} has been cancelled by the user. Stopping the current realization...")
            continue
        except Exception as e:
            updateRealizationRecord(guid,i,'ERROR',dbfile)
            logPrint(f"Ran into error: {e} on realization {guid}/{i}")
        finally:
            # Ensure the monitor process is terminated and joined
            if monitor_process.is_alive():
                try:
                    monitor_process.terminate()
                except:
                    pass
                monitor_process.join()
        

if __name__ == "__main__":
    
    # Set up signal handling in the main process
    signal.signal(signal.SIGUSR1, signal_handler)
    
    parser = argparse.ArgumentParser(description='Perform Sequential Gaussian co-simulation (Co-SGS) on a section of Greenland topography.')

    # Add arguments
    parser.add_argument('--xmin', type=float, required=False,default=None, help='The minimum x-coordinate of the section of interest.')
    parser.add_argument('--xmax', type=float, required=False,default=None, help='The maximum x-coordinate of the section of interest.')
    parser.add_argument('--ymin', type=float, required=False,default=None, help='The minimum y-coordinate of the section of interest.')
    parser.add_argument('--ymax', type=float, required=False,default=None, help='The maximum y-coordinate of the section of interest.')
    parser.add_argument('--res', type=int, required=True, help='The resolution for the simulation, indicating the grid spacing or step size.')
    parser.add_argument('--num_realizations', type=int, required=True, help='The number of simulations to be run.')
    parser.add_argument('--guid', type=str, required=True, help='The globally unique identifier for the simulation.')
    parser.add_argument('--datafile', type=str, required=True, help='Datafile to use for the simulation')
    parser.add_argument('--output_dir', type=str, required=True, help='Absolute path for ouput directory')
    parser.add_argument('--num_cpus', type=int, required=False,default = None, help='Number of CPUs to use when creating the simulation.')
    parser.add_argument('--dbfile', type=str, required=True,default = None, help='SQLITE3 database file.')

    # Parse arguments
    args = parser.parse_args()

    # Call the simulate function with the parsed arguments
    simulate(args.xmin, args.xmax, args.ymin, args.ymax, args.res, args.num_realizations, args.guid,args.datafile,args.output_dir,args.num_cpus,args.dbfile)