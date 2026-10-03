import redis from "../../shared/redis/redis.js"
import axios from "axios"
//middleware to check if user is authenticated 

const protect = async (req,res,next)=>{
    try{
        const sessionId = req.cookies?.session || 
                          req.headers["x-session-id"] || 
                          (req.headers["authorization"]?.startsWith("Bearer ") ? req.headers["authorization"].split(" ")[1] : null)
        
        // Checking if session id is present in the request
        if (!sessionId){
            console.log("Protect failed: No session ID found in cookies or headers")
            return res.status(401).json({ message: "unauthorized" })
        }

        let session = null

        // Try reading from Redis first (with 3-second timeout protection)
        try {
            if (redis.status !== "end" && redis.status !== "close") {
                session = await redis.get(`session-${sessionId}`)
                console.log("Session lookup (Redis):", session ? "found" : "not found")
            }
        } catch (redisErr) {
            console.warn("⚠️ Redis read error in protect:", redisErr.message)
        }

        // If Redis failed or did not have session, fallback to Auth Service (MongoDB)
        if (!session) {
            try {
                const authServiceUrl = process.env.AUTH_SERVICE || "http://127.0.0.1:8001"
                const { data } = await axios.get(`${authServiceUrl}/verify-session/${sessionId}`, { timeout: 3500 })
                if (data?.userId) {
                    console.log("✅ Session verified via Auth DB Fallback for user:", data.name || data.userId)
                    req.user = data
                    return next()
                }
            } catch (fallbackErr) {
                console.warn("⚠️ Auth DB fallback lookup failed:", fallbackErr?.response?.data?.message || fallbackErr.message)
            }

            console.log(`Protect failed: Session ${sessionId} expired or not found`)
            return res.status(401).json({ message: "session expired" })
        }

        // Extracting user data from the session
        req.user = JSON.parse(session)
        // Calling next middleware
        next()
    }
    catch(error){
        console.error("Protect middleware error:", error)
        return res.status(500).json({ message: `protect error: ${error.message || error}` })
    }
}

export default protect