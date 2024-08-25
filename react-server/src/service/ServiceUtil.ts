export const BASE_URL = getBaseUrl();

function getBaseUrl(): string {
    let url;
    if (process.env.REACT_APP_LOCALHOST == "true") {
        url = process.env.REACT_APP_LOCALHOST_URL;
    } else {
        url = process.env.REACT_APP_SERVER_URL;
    }
    if (!url) {
        console.warn("Server URL not found, using empty default.");
        return "";
    }
    return url;
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