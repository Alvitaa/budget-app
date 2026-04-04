const API_URL = "http://localhost:3009/";

export async function ApiFetch(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-type": "application/json",
            ...(options?.headers || {}),
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Error");
    }

    return data;
}
