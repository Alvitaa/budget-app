const API_URL = "http://localhost:3009/";

export async function ApiFetch(endpoint: string, options?: RequestInit) {
    console.log(`${API_URL}${endpoint}`);
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...(options?.headers || {}),
        },
    });

    const data = await res.json();

    if (!res.ok) {
        const error: any = new Error("Request failed");
        error.errors = data.errors || {};
        throw error;
    }

    return data;
}
