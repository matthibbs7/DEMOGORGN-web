import sys
import os


# Get the current path
current_path = os.getcwd()

# Append the current path to system paths
if current_path not in sys.path:
    sys.path.append(current_path)

from . import sgs_preprocess
from . import sgs_alg
from . import sgs_plts

import numpy as np
import pandas as pd
from pathlib import Path
import uuid 

from . import sgs_plts 



    
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))
FILE_NAME = f"{SITE_ROOT}/data/PIG_data.csv"
#FILE_NAME = "./data/total_truncated.csv"

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
    

def simulate(xmin: float, xmax: float, ymin: float, ymax : float, res: int, num_realizations: int, guid: str):
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

    Returns:
    --------
    TODO
    """

    x = "X"; y = "Y"; z = "BED" # Column headings in CSV data files
    
    # read data from input file
    df_bed = pd.read_csv(FILE_NAME)
    
    # grid data
    df_data, grid_matrix, df_nan = sgs_preprocess.grid_data(df_bed, xmin, xmax, ymin, ymax, res, x, y, z)
    
    # normal score transformation of bed elevation
    df_data.loc[:,'Norm_Bed'], nst_trans = sgs_preprocess.nscore(df_data, z)
    
    # adaptive clustering
    max_pts = 100           # maximum number of points in each cluster
    min_len = 50000         # minimum side length of squares
    df_data, i = sgs_preprocess.adaptive_partitioning(df_data, xmin, xmax, ymin, ymax, max_pts, min_len)
    
    # get number of processes to use
    processes = int(os.cpu_count())
    
    # get variograms for each cluster in parallel
    max_lag = 30000         # maximum lag distance
    n_lags = 100            # number of bins
    gamma = sgs_preprocess.get_variograms(df_data, n_lags, max_lag, processes)
    
    #guid = str(uuid.uuid4())
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
        csv_path = Path(f'{SITE_ROOT}/output/{guid}/{i}/sim.csv')
        csv_path.parent.mkdir(parents=True, exist_ok=True)
        df_sim.to_csv(csv_path, index=False)
        
        # output graph
        plot_path = Path(f'{SITE_ROOT}/output/{guid}/{i}/plot.png')
        #sgs_plts.plt_graph(df_sim, df_bed, res, x, y, z, i)
        plt_graph(df_sim, df_bed, res, x, y, z, plot_path)