export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export function polarStereographicXToLongitude(x) {
    return Math.atan2(0, x);  // Assuming minY = 0
}

export function polarStereographicYToLatitude(y) {
    const R = 6371;  // Earth's mean radius in kilometers
    const latitude = 2 * Math.atan(Math.exp(y / R)) - (Math.PI / 2);
    return (latitude * 180) / Math.PI;  // Convert radians to degrees
}

export const polarStereographicToLatLon = (minX, minY, maxX, maxY) => {
    // Assuming polar stereographic coordinates are given as minX, minY, maxX, maxY

    // Polar radius (approximate Earth radius)
    const R = 6371;  // Earth's mean radius in kilometers

    // Convert Polar Stereographic Coordinates to Transverse Mercator Coordinates
    const xMin = minY * Math.sin(minX);
    const yMin = minY * Math.cos(minX);
    const xMax = maxY * Math.sin(maxX);
    const yMax = maxY * Math.cos(maxX);

    // Convert Transverse Mercator Coordinates to Latitude and Longitude
    const latitudeMin = 2 * Math.atan(Math.exp(xMin / R)) - (Math.PI / 2);
    const longitudeMin = Math.atan2(yMin, xMin);

    const latitudeMax = 2 * Math.atan(Math.exp(xMax / R)) - (Math.PI / 2);
    const longitudeMax = Math.atan2(yMax, xMax);

    // Convert radians to degrees
    const radToDeg = (rad) => (rad * 180) / Math.PI;

    return {
        minLatitude: radToDeg(latitudeMin),
        minLongitude: radToDeg(longitudeMin),
        maxLatitude: radToDeg(latitudeMax),
        maxLongitude: radToDeg(longitudeMax),
    };
}

export const getBatchRequestsFromGUID = async (requestGUID, csrf) => {
    const req = await fetch(`/api/${'get_status'}/${requestGUID}/`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            "X-CSRFToken": csrf,
        },
    });
    const data = await req.json();
    return data
}

export const cancelSingleRequestFromGUID = async (requestGUID, realizationID, csrf) => {
    const req = await fetch(`/api/${'cancel_realization'}/${requestGUID}/${realizationID}/`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            "X-CSRFToken": csrf,
        },
    });
    return req;
}

export const cancelBatchRequestFromGUID = async (requestGUID, csrf) => {
    const req = await fetch(`/api/${'cancel_realization'}/${requestGUID}/`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            "X-CSRFToken": csrf,
        },
    });
    return req;
}

export const getUserSimulations = async () => {
    const req = await fetch(`/api/${'user_simulations'}/`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
        },
    });
    const data = await req.json();
    return data
} 

export const getRealizationImage = async (requestGUID, requestRID) => {
    const req = await fetch(`/api/${'simulation-image'}/${requestGUID}/${requestRID}/`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
        },
    });
    const data = await req.json();
    return data
}

export const getLookupRequestFromGUID = async (requestGUID, csrf) => {
    const req = await fetch(`/api/${'lookup_request'}/${requestGUID}/`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
        },
    });
    const data = await req.json();
    return data
}

export const ps2llSingle = (x, y, kwargs) => {
    // Define default values for optional keyword arguments
    let phi_c = -71; // standard parallel (degrees)
    let a = 6378137.0; // radius of ellipsoid, WGS84 (meters)
    let e = 0.08181919; // eccentricity, WGS84
    let lambda_0 = 0; // meridian along positive Y axis (degrees)

    // Parse optional keyword arguments
    for (const [key, value] of Object.entries(kwargs)) {
        const lowerKey = key.toLowerCase();
        if (lowerKey === 'true_lat') {
            phi_c = value;
            if (!Number.isNaN(phi_c)) {
                throw new Error('True lat must be a scalar.');
            }
            if (phi_c > 0) {
                console.log("I'm assuming you forgot the negative sign for the true latitude, and I am converting your northern hemisphere value to southern hemisphere.");
                phi_c = -phi_c;
            }
        } else if (lowerKey === 'earth_radius') {
            a = value;
            if (typeof a !== 'number') {
                throw new Error('Earth radius must be a scalar.');
            }
            if (a <= 7e+3) {
                throw new Error('Earth radius should be something like 6378137 in meters.');
            }
        } else if (lowerKey === 'eccentricity') {
            e = value;
            if (typeof e !== 'number') {
                throw new Error('Earth eccentricity must be a scalar.');
            }
            if (!(0 <= e && e < 1)) {
                throw new Error('Earth eccentricity does not seem like a reasonable value.');
            }
        } else if (lowerKey === 'meridian') {
            lambda_0 = value;
            if (typeof lambda_0 !== 'number') {
                throw new Error('meridian must be a scalar.');
            }
            if (!(lambda_0 >= -180 && lambda_0 <= 360)) {
                throw new Error('meridian does not seem like a logical value.');
            }
        } else {
            console.log("At least one of your input arguments is invalid. Please try again.");
            return [0];
        }
    }

    // Convert to radians and switch signs
    phi_c = -phi_c * Math.PI / 180;
    lambda_0 = -lambda_0 * Math.PI / 180;
    x = -x;
    y = -y;

    // Calculate constants
    const t_c = Math.tan(Math.PI / 4 - phi_c / 2) / Math.pow((1 - e * Math.sin(phi_c)) / (1 + e * Math.sin(phi_c)), e / 2);
    const m_c = Math.cos(phi_c) / Math.sqrt(1 - e ** 2 * Math.sin(phi_c) ** 2);

    // Calculate rho and t
    const rho = Math.sqrt(x ** 2 + y ** 2);
    const t = rho * t_c / (a * m_c);

    // Calculate chi
    const chi = Math.PI / 2 - 2 * Math.atan(t);

    // Calculate lat
    let lat = chi + (e ** 2 / 2 + 5 * e ** 4 / 24 + e ** 6 / 12 + 13 * e ** 8 / 360) * Math.sin(2 * chi)
        + (7 * e ** 4 / 48 + 29 * e ** 6 / 240 + 811 * e ** 8 / 11520) * Math.sin(4 * chi)
        + (7 * e ** 6 / 120 + 81 * e ** 8 / 1120) * Math.sin(6 * chi)
        + (4279 * e ** 8 / 161280) * Math.sin(8 * chi);

    // Calculate lon
    let lon = lambda_0 + Math.atan2(x, -y);

    // Correct the signs and phasing
    lat = -lat;
    lon = -lon;
    lon = (lon + Math.PI) % (2 * Math.PI) - Math.PI;

    // Convert back to degrees
    lat = lat * 180 / Math.PI;
    lon = lon * 180 / Math.PI;

    // Make two-column format if user requested no outputs
    if (kwargs && kwargs['nargout'] === 0) {
        return [[lat, lon]];
    }

    return [lat.toFixed(4), lon.toFixed(4)];
}

export const ps2ll = (minX, minY, maxX, maxY) => {
    // Convert minX, minY, maxX, maxY to X, Y coordinates
    const xMin = minX;
    const yMin = minY;
    const xMax = maxX;
    const yMax = maxY;

    // Perform transformation for minX, minY, maxX, maxY
    const transformedMin = ps2llSingle(xMin, yMin, {});
    const transformedMax = ps2llSingle(xMax, yMax, {});

    return [...transformedMin, ...transformedMax]; // Concatenating transformed values for min and max coordinates
}