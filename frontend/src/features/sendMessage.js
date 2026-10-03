
import api from '../../utils/axios'

async function sendMessage(payload) {
    try {
        const { data } = await api.post("/api/agent/chat", payload)
        return data
    } catch (error) {
        console.error("sendMessage error:", error)
        return {
            answer: error?.response?.data?.answer || error?.response?.data?.message || error?.message || "Failed to communicate with agent service."
        }
    }
}

export default sendMessage
