const baseUrl = "https://madness.basefive.org:3001";

export function get(url: string, jwt?: string): Promise<Response> {
    const fullUrl = baseUrl + url;
    return fetch(fullUrl, {
        method: "GET",
        headers: {
            "Authorization": jwt ? `Bearer ${jwt}` : "",
            "Accept": "application/json",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
        }
    }).then(response => response.ok ? response : Promise.reject(response));
}

export function post(url: string, jwt: string, body?: any): Promise<Response> {
    const fullUrl = baseUrl + url;
    return fetch(fullUrl, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Authorization": `Bearer ${jwt}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
        }
    }).then(response => response.ok ? response : Promise.reject(response));
}