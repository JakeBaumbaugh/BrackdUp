const baseUrl = process.env.REACT_APP_SERVER_URL ?? "";

export function get(url: string, jwt?: string): Promise<Response> {
    const fullUrl = baseUrl + url;
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
    const fullUrl = baseUrl + url;
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
    const fullUrl = baseUrl + url;
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