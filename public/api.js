const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
        "Accept": "application/json",
        "Content": "application/json"
    }
});

api.interceptors.request.use((config) => {
    const token = "5cbb69cc44ce13647f02c1e350b1a1930eecaea6epqd9u2r588";

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});