export const BASE_URL = process.env.REACT_APP_SERVER_URL ?? "";
if(!process.env?.REACT_APP_SERVER_URL) {
    console.warn("Server URL not found, using empty default.");
}

export function get(url: string, jwt?: string): Promise<Response> {
    const fullUrl = BASE_URL + url;
    return fetch(fullUrl, {
        method: "GET",
        credentials: "include",
        headers: {
            "Authorization": jwt ? `Bearer ${jwt}` : "",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }).then(response => response.ok ? response : Promise.reject(response));
}

export function post(url: string, body?: any, jwt?: string): Promise<Response> {
    const fullUrl = BASE_URL + url;
    return fetch(fullUrl, {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${jwt}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }).then(response => response.ok ? response : Promise.reject(response));
}

export function delet(url: string, jwt?: string): Promise<Response> {
    const fullUrl = BASE_URL + url;
    return fetch(fullUrl, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Authorization": `Bearer ${jwt}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    }).then(response => response.ok ? response : Promise.reject(response));
}