export const apiFetch = async (url, options = {}) => {
    const adminToken = localStorage.getItem('adminToken');
    const clientToken = localStorage.getItem('clientToken');
    const token = adminToken || clientToken;

    const headers = {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    // Если отправляем JSON ставим Content-Type
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (res.status === 403 || res.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('clientToken');

        return { failed: true };
    }

    return res.json();
}