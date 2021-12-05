const baseURL = 'http://localhost:3333';

const api = axios.create({
    baseURL,
    headers: {
        "Accept": "application/json",
        "Content": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});