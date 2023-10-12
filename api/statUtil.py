import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.axes_grid1 import make_axes_locatable
from matplotlib.colors import LightSource
from sklearn.preprocessing import QuantileTransformer 
import skgstat as skg
from skgstat import models
import gstatsim as gs
import random
import os
import time

SITE_ROOT = os.path.dirname(os.path.realpath(__file__))

def logPrint(msg: str):
    print(f"{time.ctime()}: {msg}")

def cosim_mm1(minx: int, maxx: int, miny: int, maxy: int, res: int, sim_num: int, k: int, rad: int):
    """
    Performs Sequential Gaussian co-simulation (Co-SGS) on a section of Greenland topography.

    Parameters:
    -----------
    minx : int
        The minimum x-coordinate of the section of interest.

    maxx : int
        The maximum x-coordinate of the section of interest.

    miny : int
        The minimum y-coordinate of the section of interest.

    maxy : int
        The maximum y-coordinate of the section of interest.

    res : int
        The resolution for the simulation, indicating the grid spacing or step size.

    sim_num : int
        The number of simulations to be run.

    k : int
        The number of data points to use to simulate a single unsampled point.

    rad : int
        The search radius in meters for neighboring points

    Returns:
    --------
    TODO
    """

    # Load bed and surface data into dataFrames
    data_dir = os.path.join(SITE_ROOT, "data") 
    bed_data_path = os.path.join(data_dir,"greenland_test_data.csv")
    surface_data_path = os.path.join(data_dir,"greenland_surface_data.csv")

    logPrint("Loading Data...")
    df_bed = pd.read_csv(bed_data_path)
    df_surface = pd.read_csv(surface_data_path) 
    logPrint("Data loaded successfully!")
    
#   greenland_test_data.csv:
#       X: From -300,000 to -150,000
#       Y: From -1,800,000 to -1,650,000
#   greenland_surface_data.csv:
#       X: From -299,900 to -150,100
#       Y: From -1,800,000 to -1,650,000
    
    # Ensure that min/max are within range. 
    
    data_minx = int(np.min(df_bed['X']))
    data_maxx = int(np.max(df_bed['X']))
    
    data_miny = int(np.min(df_bed['Y']))
    data_maxy = int(np.max(df_bed['Y']))
    
    if minx < data_minx:
        logPrint(f"Minx value {minx} is out of bounds. Setting to: {data_minx}")
        minx = data_minx
    
    if maxx > data_maxx:
        logPrint(f"Maxx value {maxx} is out of bounds. Setting to: {data_maxx}")
        maxx = data_maxx
    
    
    if miny < data_miny:
        logPrint(f"Miny value {miny} is out of bounds. Setting to: {data_miny}")
        miny = data_miny
        
    if maxy > data_maxy:
        logPrint(f"Maxy value {maxy} is out of bounds. Setting to: {data_maxy}")
        maxy = data_maxy
        
    
    # Filter both data frames according to the desired min/max range. 
    filtered_df_bed = df_bed[(df_bed['X'] >= minx) & (df_bed['X'] <= maxx) &  (df_bed['Y'] >= miny) & (df_bed['Y'] <= maxy)]
    filtered_df_surface = df_surface[(df_surface['X'] >= minx) & (df_surface['X'] <= maxx) &  (df_surface['Y'] >= miny) & (df_surface['Y'] <= maxy)]

    df_bed = filtered_df_bed
    df_surface = filtered_df_surface
    
    # Remove erroneous data 
    df_bed = df_bed[df_bed["Bed"] <= 700]  
    
    #### TODO: Make and Save Plots 
    
    #### Grid and transform data. Get variogram parameters
    df_grid, grid_matrix, rows, cols = gs.Gridding.grid_data(df_bed, 'X', 'Y', 'Bed', res) # grid data
    df_grid = df_grid[df_grid["Z"].isnull() == False]  # remove coordinates with NaNs
    df_grid = df_grid.rename(columns = {"Z": "Bed"}) # rename column for consistency
        
    # normal score transformation
    data = df_grid['Bed'].values.reshape(-1,1)
    nst_trans = QuantileTransformer(n_quantiles=500, output_distribution="normal").fit(data)
    df_grid['Nbed'] = nst_trans.transform(data) 

    # compute experimental (isotropic) variogram
    coords = df_grid[['X','Y']].values
    values = df_grid['Nbed']

    maxlag = 50000 # maximum range distance
    n_lags = 70 #num of bins

    V1 = skg.Variogram(coords, values, bin_func = "even", n_lags = n_lags, 
                       maxlag = maxlag, normalize=False)

    V1.model = 'exponential' # use exponential variogram model
    
    # ice surface normal score transformation
    df_surface_grid, surface_grid_matrix, rows, cols = gs.Gridding.grid_data(df_surface, 'X', 'Y', 'Surface', res) # grid data
    df_surface_grid = df_surface_grid.rename(columns = {"Z": "Surface"}) # rename column for consistency

    # normal score transformation
    data_surf = df_surface_grid['Surface'].values.reshape(-1,1)
    nst_trans_surf = QuantileTransformer(n_quantiles=500, output_distribution="normal").fit(data_surf)
    df_surface_grid['Nsurf'] = nst_trans_surf.transform(data_surf) 
    
    # find co-located secondary data (this may take a few minutes)
    df_colocated = gs.NearestNeighbor.find_colocated(df_grid, 'X', 'Y', 'Nbed', df_surface_grid, 'X', 'Y', 'Nsurf')

    #### TODO: Make and save colocated and normalized surface plots
    # compute correlation coefficient
    rho12 = np.corrcoef(df_grid['Nbed'],df_colocated['colocated'])
    corrcoef = rho12[0,1]
    
    #### TODO: Make and save bed vs surface plots 
    
    #### Initialize Grid 
    
    Pred_grid_xy = gs.Gridding.prediction_grid(minx, maxx, miny, maxy, res)
    
    
    #### Cokring 
    # set variogram parameters
    azimuth = 0
    nugget = V1.parameters[2]

    # the major and minor ranges are the same in this example because it is isotropic
    major_range = V1.parameters[0]
    minor_range = V1.parameters[0]
    sill = V1.parameters[1] 
    vtype = 'Exponential'
    vario = [azimuth, nugget, major_range, minor_range, sill, vtype]

    k = 100         # number of neighboring data points used to estimate a given point 
    rad = 50000     # 50 km search radius

    est_cokrige, var_cokrige = gs.Interpolation.cokrige_mm1(Pred_grid_xy, df_grid, 'X', 'Y', 'Nbed', 
                                         df_surface_grid, 'X', 'Y', 'Nsurf', k, vario, rad, corrcoef) 
    

    # reverse normal score transformation
    var_cokrige[var_cokrige < 0] = 0; # make sure variances are non-negative
    std_cokrige = np.sqrt(var_cokrige) # convert to standard deviation (this should be done before back transforming!!!)

    # reshape
    est = est_cokrige.reshape(-1,1)
    std = std_cokrige.reshape(-1,1)

    # back transformation
    cokrige_pred_trans = nst_trans.inverse_transform(est)
    cokrige_std_trans = nst_trans.inverse_transform(std)
    cokrige_std_trans = cokrige_std_trans - np.min(cokrige_std_trans)
    
    #### TODO: Make and Save Co-kriging with MM1 chart 
    #### Sequential Gaussian co-simulation (Co-SGS)
    
    cosim = gs.Interpolation.cosim_mm1(Pred_grid_xy, df_grid, 'X', 'Y', 'Nbed', 
                                     df_surface_grid, 'X', 'Y', 'Nsurf', k, vario, rad, corrcoef)
    
    # reverse normal score transformation
    sgs_cosim = cosim.reshape(-1,1)
    cosim_trans = nst_trans.inverse_transform(sgs_cosim)
    

    ####TODO: Make and Save Co-Simulation with MM1 
    
    
    ####TODO: Make and save variogram comparison 