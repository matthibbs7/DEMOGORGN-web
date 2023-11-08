import sys
import os
import argparse



import sgs_preprocess
import sgs_alg
import sgs_plts

import numpy as np
import pandas as pd
from pathlib import Path





def plt_graph(sim, df_bed, res, x, y, z, filename):

    # 2D hillshade topographic plot
    title = f'Bed Elevation Model'

    mu = np.mean(sim[z]); sd = np.std(sim[z])
    vmin = mu - 3*sd ; vmax = mu + 3*sd

    xmin = np.min(df_bed[x]); xmax = np.max(df_bed[x])
    ymin = np.min(df_bed[y]); ymax = np.max(df_bed[y])

    grid_xy, rows, cols = sgs_plts.prediction_grid(xmin, xmax, ymin, ymax, res)
    
    plot_i = sgs_plts.mplot(grid_xy, sim[[z]].to_numpy(), rows, cols, title, vmin = vmin, vmax = vmax, hillshade=True)
    plot_i.savefig(filename, bbox_inches = 'tight')
    

def simulate(xmin: float, xmax: float, ymin: float, ymax : float, res: int, num_realizations: int, guid: str, datafile: str, output_dir: str, num_cpus: int):
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
        print("No CPU count was specified, program will run on all cores available.")
        processes = int(os.cpu_count())
    else: 
        processes = num_cpus
    
    # get variograms for each cluster in parallel
    max_lag = 30000         # maximum lag distance
    n_lags = 100            # number of bins
    gamma = sgs_preprocess.get_variograms(df_data, n_lags, max_lag, processes)
    

    for i in range(num_realizations):

        print(f'-----------------------------------------')
        print(f'\tStarting Realization #{i+1}\n')

        
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
        df_sim.to_csv(csv_path, index=False)
        
        # output graph
        plot_path = Path(f'{output_dir}/{guid}/{i}/plot.png')
        #sgs_plts.plt_graph(df_sim, df_bed, res, x, y, z, i)
        plt_graph(df_sim, df_bed, res, x, y, z, plot_path)
        
if __name__ == "__main__":
    
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

    # Parse arguments
    args = parser.parse_args()

    # Call the simulate function with the parsed arguments
    simulate(args.xmin, args.xmax, args.ymin, args.ymax, args.res, args.num_realizations, args.guid,args.datafile,args.output_dir,args.num_cpus)