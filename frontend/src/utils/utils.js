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
    const req = await fetch(`/api/${'get_status'}/${requestGUID}`, {
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
    const req = await fetch(`/api/${'cancel_realization'}/${requestGUID}/${realizationID}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            "X-CSRFToken": csrf,
        },
    });
    const data = await req.json();
    return data
}

export const cancelBatchRequestFromGUID = async (requestGUID, csrf) => {
    const req = await fetch(`/api/${'cancel_realization'}/${requestGUID}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            "X-CSRFToken": csrf,
        },
    });
    const data = await req.json();
    return data
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