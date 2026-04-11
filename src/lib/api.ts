const API_URL = "http://localhost:3009/";

export async function apiFetch(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: {
            "Content-type": "application/json",
            ...(options?.headers || {}),
        },
    });

    let data = null;

    if (res.status !== 204) {
        data = await res.json();
    }

    if (!res.ok) {
        console.log(data); //For debugging
        const error: any = new Error("Request failed");
        error.errors = data.error || data.errors || {};
        throw error;
    }

    return data;
}
