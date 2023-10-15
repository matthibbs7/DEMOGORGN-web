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
import matplotlib
matplotlib.use('Agg') 

SITE_ROOT = os.path.dirname(os.path.realpath(__file__))

def find_nearby_factors_int(X, Y, Z, search_range=10):
    """
    Find A and B close to Y and Z such that A * B = X.

    Parameters:
    - X: the target product
    - Y, Z: initial guesses for A and B
    - search_range: the range around Y and Z to search for factors

    Returns:
    - A, B: factors close to Y and Z such that A * B = X
    """
    logPrint(f"Starting search for factors of {X} around Y={Y} and Z={Z} with search range={search_range}.")
    
    A, B = Y, Z

    # Try adjusting A first
    for delta_A in range(1, search_range + 1):
        for direction in [1, -1]:  # Try adding and then subtracting
            A_adj = Y + direction * delta_A
            B = X // A_adj if A_adj != 0 else 0
            if A_adj * B == X:
                logPrint(f"Found factors by adjusting A: A={A_adj}, B={B}")
                return A_adj, B

    # Try adjusting B next if adjusting A didn't work
    for delta_B in range(1, search_range + 1):
        for direction in [1, -1]:  # Try adding and then subtracting
            B_adj = Z + direction * delta_B
            A = X // B_adj if B_adj != 0 else 0
            if A * B_adj == X:
                logPrint(f"Found factors by adjusting B: A={A}, B={B_adj}")
                return A, B_adj

    # If we didn't find exact factors, return the original guesses
    logPrint(f"No exact factors found in the search range. Returning initial guesses: A={Y}, B={Z}")
    raise RuntimeError(f"Unable to find factors of {X}")
    return Y, Z



def validateDimensions(arraySize, rows, columns) -> tuple:

    ylen_potential = rows
    xlen_potential = columns
    logPrint(f"Initial values of xlength:{xlen_potential} and ylength:{ylen_potential}")
    lengthsFound = False 
    logPrint(f"Searching for factors of arraySize: {arraySize}")
    while not lengthsFound:
        if arraySize % ylen_potential == 0:
            lengthsFound = True 
            xlen_potential = arraySize / ylen_potential
            logPrint("Value found!")
        else:
            logPrint(f"xLength: {ylen_potential} is not a factor of the array. Decrementing and trying again.") 
            ylen_potential = ylen_potential + 1
            
        
    logPrint(f"Values found! xlength:{xlen_potential} and ylength:{ylen_potential}")
    return (int(xlen_potential), int(ylen_potential))

def getXYLengths(arraySize: int ,xmin: float, xmax: float , ymin: float, ymax: float) -> tuple:
    aspect_ratio = (ymax - ymin) / (xmax - xmin)
    ylen_potential = int(np.sqrt(arraySize * aspect_ratio))
    xlen_potential = int(arraySize / ylen_potential)
    logPrint(f"Initial values of xlength:{xlen_potential} and ylength:{ylen_potential}")
    lengthsFound = False 
    logPrint(f"Searching for factors of arraySize: {arraySize} near the aspect ratio {aspect_ratio}")
    while not lengthsFound:
        if arraySize % xlen_potential == 0:
            lengthsFound = True 
            ylen_potential = arraySize / xlen_potential
            logPrint("Value found!")
        else:
            logPrint(f"xLength: {xlen_potential} is not a factor of the array. Decrementing and trying again.") 
            xlen_potential = xlen_potential - 1
            
        
    logPrint(f"Values found! xlength:{xlen_potential} and ylength:{ylen_potential}")
    return (int(xlen_potential), int(ylen_potential))

def logPrint(msg: str):
    print(f"{time.ctime()}: {msg}")

def cosim_mm1(minx: float, maxx: float, miny: float, maxy: float, res: int, sim_num: int, k: int, rad: int):
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

    output_dir = os.path.join(SITE_ROOT, "output") # Make Unique to inbound request (to avoid conflicts on concurrent requests)
    primary_data_plot = os.path.join(output_dir, "primary_data_plot.png")
    secondary_data_plot = os.path.join(output_dir, "secondary_data_plot.png")
    normalized_bed_and_colocated_surface_plot = os.path.join(output_dir, "normalized_bed_and_colocated_surface_plot.png")
    bed_vs_surface_plot = os.path.join(output_dir, "bed_vs_surface_plot.png")
    cokriging_with_mm1_plot = os.path.join(output_dir, "cokriging_with_mm1_plot.png") 
    cosimulation_with_mm1_plot = os.path.join(output_dir, "cosimulation_with_mm1_plot.png") 
    variogram_comparison_plot = os.path.join(output_dir, "variogram_comparison_plot.png")
    metadata_file = os.path.join(output_dir, "metadata.txt")
    # Load bed and surface data into dataFrames
    data_dir = os.path.join(SITE_ROOT, "data") 
    bed_data_path = os.path.join(data_dir,"greenland_test_data.csv")
    surface_data_path = os.path.join(data_dir,"greenland_surface_data.csv")

    logPrint("Loading Data...")
    df_bed = pd.read_csv(bed_data_path)
    df_surface = pd.read_csv(surface_data_path) 
    logPrint("Data loaded successfully!")
    
#   greenland_test_data.csv:
#       X: From -300000 to -150000
#       Y: From -1800000 to -1650000
#   greenland_surface_data.csv:
#       X: From -299900 to -150100
#       Y: From -1800000 to -1,650000
    
    minx = -280000 ; maxx = -160000 ; miny = -1780000 ; maxy = -1670000; res = 1000; sim_num = 1
    #minx = data_minx ; maxx = data_maxx ; miny = data_miny ; maxy = data_maxy
    
        #X:  -280000  -> -160000
        #Y: -1780000 -> -1670000
    # Ensure that min/max are within range. 
    
    data_minx = float(np.min(df_bed['X']))
    data_maxx = float(np.max(df_bed['X']))
    
    data_miny = float(np.min(df_bed['Y']))
    data_maxy = float(np.max(df_bed['Y']))
    
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
    
    
    
    ##Primary Data 
    
    logPrint("Generating Primary Data Graph. ")
    # plot data
    fig = plt.figure(figsize = (5,5))
    ax = plt.gca()
    im = ax.scatter(df_bed['X'], df_bed['Y'], c=df_bed['Bed'], vmin=-400, vmax=600, 
                         marker='.', s=0.5, cmap='gist_earth')
    plt.title('Subglacial topography data')
    plt.xlabel('X [m]'); plt.ylabel('Y [m]')
    plt.locator_params(nbins=5)
    plt.axis('scaled')

    # make colorbar
    divider = make_axes_locatable(ax)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(-400, 600, 11), cax=cax)
    cbar.set_label("Bed elevation [m]", rotation=270, labelpad=15)
    logPrint("Done Primary Data Graph! ")
    
    logPrint(f"Saving the graph to: {primary_data_plot}")
    plt.savefig(primary_data_plot,dpi=300)
    logPrint("Graph saved. ")

    ## Secondary Data 
    logPrint("Generating secondary data plot.")
    # make hillshade plot for visualizing
    
    ### Example from notebook
    #tempRes = 200
    #xmin = minx; xmax = maxx     # min and max x values
    #ymin = miny; ymax = maxy

    ## reshape grid
    #ylen = (ymax + tempRes - ymin)/tempRes
    #xlen = (xmax + tempRes - xmin)/tempRes
    #elevation =  np.reshape(df_surface['Surface'].values, (int(xlen), int(ylen)))
    
    ### Determine Resolution. 
    xmin = minx; xmax = maxx     # min and max x values
    ymin = miny; ymax = maxy
    
    
    elevationGridDimensions = getXYLengths(len(df_surface['Surface'].values),xmin,xmax,ymin,ymax) # Returns tuple where first element is X length and second element is y length
    elevation = np.reshape(df_surface['Surface'].values, (elevationGridDimensions[1],elevationGridDimensions[0] ))
    
    elevation = elevation.T 

    # Shade from the northeast, with the sun 45 degrees from horizontal
    ls = LightSource(azdeg=45, altdeg=45)

    # leaving the dx and dy as 1 means a vertical exageration equal to dx/dy
    hillshade = ls.hillshade(elevation, vert_exag=1, dx=1, dy=1, fraction=1.0)

    fig, ax = plt.subplots(figsize=(5,5))
    im = ax.imshow(elevation, vmin=500, vmax=2500, cmap='cividis')
    ax.imshow(hillshade, cmap='Greys', alpha=0.1)
    ax.set_title('Ice surface')
    ax.set_xlabel('X [px]'); ax.set_ylabel('Y [px]')
    divider = make_axes_locatable(ax)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(500, 2500, 11), cax=cax)
    cbar.set_label("Bed elevation [m]", rotation=270, labelpad=15)
    ax.axis('scaled')
    plt.savefig(secondary_data_plot,dpi=300) # TODO: Save data for plots as CSV alongside the plot. 

    #### Grid and transform data. Get variogram parameters
    
    logPrint("Gridding data")
    df_grid, grid_matrix, rows, cols = gs.Gridding.grid_data(df_bed, 'X', 'Y', 'Bed', res) # grid data
    logPrint("Done gridding the data.")
    df_grid = df_grid[df_grid["Z"].isnull() == False]  # remove coordinates with NaNs
    df_grid = df_grid.rename(columns = {"Z": "Bed"}) # rename column for consistency
        
    # normal score transformation
    data = df_grid['Bed'].values.reshape(-1,1)
    logPrint("Fitting the QuantileTransformer to the data for future back transformation...")
    nst_trans = QuantileTransformer(n_quantiles=500, output_distribution="normal").fit(data)
    logPrint("Done fitting the QuantileTransformer.")
    logPrint("Performing normal transformation of data of primary data.")
    df_grid['Nbed'] = nst_trans.transform(data) 
    logPrint("Normal transformation completed.")

    # compute experimental (isotropic) variogram
    coords = df_grid[['X','Y']].values
    values = df_grid['Nbed']

    maxlag = 50000 # maximum range distance
    n_lags = 70 #num of bins

    logPrint("Creating variogram....")
    V1 = skg.Variogram(coords, values, bin_func = "even", n_lags = n_lags, 
                       maxlag = maxlag, normalize=False)
    logPrint("Done creating the variogram.")

    V1.model = 'exponential' # use exponential variogram model
    
    # ice surface normal score transformation
    df_surface_grid, surface_grid_matrix, rows, cols = gs.Gridding.grid_data(df_surface, 'X', 'Y', 'Surface', res) # grid data
    df_surface_grid = df_surface_grid.rename(columns = {"Z": "Surface"}) # rename column for consistency

    # normal score transformation
    data_surf = df_surface_grid['Surface'].values.reshape(-1,1)
    nst_trans_surf = QuantileTransformer(n_quantiles=500, output_distribution="normal").fit(data_surf)
    df_surface_grid['Nsurf'] = nst_trans_surf.transform(data_surf) 
    
    # find co-located secondary data (this may take a few minutes)
    logPrint("Finding co-located secondary data (this may take a few minutes) ...")
    df_colocated = gs.NearestNeighbor.find_colocated(df_grid, 'X', 'Y', 'Nbed', df_surface_grid, 'X', 'Y', 'Nsurf')
    logPrint("Done getting co-located secondary data!")
    #### TODO: Make and save colocated and normalized surface plots
    logPrint("Generating Plots for normalized and co-located data.")
    # plot normalized co-located data
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10,5))    
    im = ax1.scatter(df_grid['X'], df_grid['Y'], c=df_grid['Nbed'], vmin=-3, vmax=3, cmap='gist_earth', 
                     s=5, marker=".")
    ax1.set_title('Normalized Bed')
    ax1.set_xlabel('X (m)'); ax1.set_ylabel('Y (m)')
    ax1.locator_params(nbins=5)
    divider = make_axes_locatable(ax1)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(-3, 3, 7), cax=cax)
    cbar.set_label("Normalized bed elevation", rotation=270, labelpad=15)
    ax1.axis('scaled')

    im = ax2.scatter(df_grid['X'], df_grid['Y'], c=df_colocated['colocated'], vmin=-3, vmax=3, cmap='cividis', 
                     s=5, marker=".")
    ax2.set_title('Normalized co-located surface')
    ax2.set_xlabel('X (m)'); ax2.set_ylabel('Y (m)')
    ax2.locator_params(nbins=5)
    divider = make_axes_locatable(ax2)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(-3, 3, 7), cax=cax)
    cbar.set_label("Normalized surface elevation", rotation=270, labelpad=15)
    ax2.axis('scaled')

    plt.tight_layout()
    logPrint(f"Saving graph to: {normalized_bed_and_colocated_surface_plot}")
    plt.savefig(normalized_bed_and_colocated_surface_plot,dpi=300) 
    logPrint("Graph saved. ")
    #### TODO: Save normalized co-located data long with the plots 
    
    # compute correlation coefficient
    rho12 = np.corrcoef(df_grid['Nbed'],df_colocated['colocated'])
    corrcoef = rho12[0,1]
    
    
    # scatter plot
    logPrint("Creating Scatter plot of Surface vs Bed values.")
    plt.figure(figsize=(5,5))
    im = plt.scatter(df_grid['Nbed'], df_colocated['colocated'], alpha=0.3, marker='.')
    plt.title('Bed vs. surface')
    plt.xlabel('Normalized bed')
    plt.ylabel('Normalized surface')
    plt.axis('scaled') 
    logPrint(f"Saving graph to: {bed_vs_surface_plot}")
    plt.savefig(bed_vs_surface_plot,dpi=300) ## TODO: Save Source plot data.
    logPrint("Done saving the graph.")
    #### Initialize Grid 
    
    logPrint("Creating a prediction grid.")
    Pred_grid_xy = gs.Gridding.prediction_grid(minx, maxx, miny, maxy, res)
    logPrint("Done creating a prediction grid.")
    
    
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

    logPrint("Performing Co-krige analysis.")
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
    # make hillshade for visualizing
    vmin = -400; vmax = 600
    
    #Tweak rows and columns (math doesnt work out for reshaping arrays in grid with certain x and y ranges )
    
    
    rows, cols = find_nearby_factors_int(len(Pred_grid_xy[:,0]),rows,cols,50)

    x_mat = Pred_grid_xy[:,0].reshape((rows, cols))
    y_mat = Pred_grid_xy[:,1].reshape((rows, cols))
    mat = cokrige_pred_trans.reshape((rows, cols))
    xmin = Pred_grid_xy[:,0].min(); xmax = Pred_grid_xy[:,0].max()
    ymin = Pred_grid_xy[:,1].min(); ymax = Pred_grid_xy[:,1].max()

    cmap=plt.get_cmap('gist_earth')
    fig, ax = plt.subplots(1, figsize=(5,5))
    im = ax.pcolormesh(x_mat, y_mat, mat, vmin=vmin, vmax=vmax, cmap=cmap)

    # Shade from the northeast, with the sun 45 degrees from horizontal
    ls = LightSource(azdeg=45, altdeg=45)

    # leaving the dx and dy as 1 means a vertical exageration equal to dx/dy
    hillshade = ls.hillshade(mat, vert_exag=1, dx=1, dy=1, fraction=1.0)
    plt.pcolormesh(x_mat, y_mat, hillshade, cmap='gray', alpha=0.1)
    plt.title('Co-kriging with MM1')
    plt.xlabel('X [m]'); plt.ylabel('Y [m]')
    plt.xticks(np.linspace(xmin, xmax, 5))
    plt.yticks(np.linspace(ymin, ymax, 5))

    # make colorbar
    divider = make_axes_locatable(ax)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(-400, 600, 11), cax=cax)
    cbar.set_label("Bed elevation [m]", rotation=270, labelpad=15)
    ax.axis('scaled')
    logPrint(f"Saving graph to: {cokriging_with_mm1_plot}")
    plt.savefig(cokriging_with_mm1_plot,dpi=300) ## TODO: Save Source plot data.
    logPrint("Done saving the graph.")
    #### Sequential Gaussian co-simulation (Co-SGS)
    
    cosim = gs.Interpolation.cosim_mm1(Pred_grid_xy, df_grid, 'X', 'Y', 'Nbed', 
                                     df_surface_grid, 'X', 'Y', 'Nsurf', k, vario, rad, corrcoef)
    
    # reverse normal score transformation
    sgs_cosim = cosim.reshape(-1,1)
    cosim_trans = nst_trans.inverse_transform(sgs_cosim)
    

    ####TODO: Make and Save Co-Simulation with MM1 
    # make hillshade for visualizing
    mat = cosim_trans.reshape((rows, cols))
    vmin = -400; vmax = 600    
    cmap=plt.get_cmap('gist_earth')
    fig, ax = plt.subplots(1, figsize=(5,5))
    im = ax.pcolormesh(x_mat, y_mat, mat, vmin=vmin, vmax=vmax, cmap=cmap)

    # Shade from the northeast, with the sun 45 degrees from horizontal
    ls = LightSource(azdeg=45, altdeg=45)

    # leaving the dx and dy as 1 means a vertical exageration equal to dx/dy
    hillshade = ls.hillshade(mat, vert_exag=1, dx=1, dy=1, fraction=1.0)
    plt.pcolormesh(x_mat, y_mat, hillshade, cmap='gray', alpha=0.1)
    plt.title('Co-simulation with MM1')
    plt.xlabel('X [m]'); plt.ylabel('Y [m]')
    plt.xticks(np.linspace(xmin, xmax, 5))
    plt.yticks(np.linspace(ymin, ymax, 5))

    # make colorbar
    divider = make_axes_locatable(ax)
    cax = divider.append_axes('right', size='5%', pad=0.1)
    cbar = plt.colorbar(im, ticks=np.linspace(-400, 600, 11), cax=cax)
    cbar.set_label("Bed elevation [m]", rotation=270, labelpad=15)
    ax.axis('scaled')
    logPrint(f"Saving graph to: {cosimulation_with_mm1_plot}")
    plt.savefig(cosimulation_with_mm1_plot,dpi=300) ## TODO: Save Source plot data.
    logPrint("Done saving the graph.")
    
    ####TODO: Make and save variogram comparison 
    
    # variogram comparison
    # downsample random indices to speed this up
    rand_indices = random.sample(range(np.shape(Pred_grid_xy)[0]),5000)

    # get normalized cosimulation data
    coords_s = Pred_grid_xy[rand_indices]
    values_s = cosim[rand_indices]

    VS = skg.Variogram(coords_s, values_s, bin_func = "even", n_lags = n_lags, 
                       maxlag = maxlag, normalize=False)
    # experimental variogram (from beginning of script)
    xe = V1.bins
    ye = V1.experimental

    # simple kriging variogram
    xs = VS.bins
    ys = VS.experimental

    plt.figure(figsize=(6,4))
    plt.plot(xe, ye, 'og', markersize=4, label='Variogram of data')
    plt.plot(xs, ys, 'ok', markersize=4, label='Variogram of Co-SGS with MM1 simulation')
    plt.title('Variogram Comparison')
    plt.xlabel('Lag (m)'); plt.ylabel('Semivariance')  
    plt.legend(loc='lower right')
    logPrint(f"Saving graph to: {variogram_comparison_plot}")
    plt.savefig(variogram_comparison_plot,dpi=300) ## TODO: Save Source plot data.
    logPrint("Done saving the graph.")
    
    
    
    # find correlation coefficient between total surface dataset and simulation 

    #rho12 = np.corrcoef(cosim,df_surface_grid['Nsurf']) # compute correlation coefficient
    #corrcoef = rho12[0,1]
    #print('Correlation coefficient between simulated bed and surface: ' + str(corrcoef))
    #
    #with open(metadata_file, 'a') as file:
    #    file.write('Correlation coefficient between simulated bed and surface: ' + str(corrcoef) + '\n')