//fetching current user data from the server using axios
import api from "../../utils/axios"

const getCurrentUser=async () => {
    //try block for handling errors
    try {
        const {data}=await api.get("/api/me")
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}

export default getCurrentUser