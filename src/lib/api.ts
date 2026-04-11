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

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
        const error: any = new Error("Request failed");
        error.errors = data.error || data.errors || {};
        throw error;
    }

    return data;
}
