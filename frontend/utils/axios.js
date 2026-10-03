import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_SERVER_URL,
    //for passing the cookies to the server
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const sessionId = localStorage.getItem("sessionId")
    if (sessionId) {
        config.headers["x-session-id"] = sessionId
        config.headers["Authorization"] = `Bearer ${sessionId}`
    }
    return config
})

export default api
