// TODO change to localhost??
const HOST_PREFIX = process.env.HOST_PREFIX ?? 'http://127.0.0.1:8000';

export const getBatchRequestsFromGUID = async (requestGUID, csrf) => {
    const req = await fetch(`${HOST_PREFIX}/api/${'get_status'}/${requestGUID}`, {
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
    const req = await fetch(`${HOST_PREFIX}/api/${'cancel_realization'}/${requestGUID}/${realizationID}`, {
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
    const req = await fetch(`${HOST_PREFIX}/api/${'cancel_realization'}/${requestGUID}`, {
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