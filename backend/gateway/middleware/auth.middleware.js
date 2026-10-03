import redis from "../../shared/redis/redis.js"
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

        // Auto-reconnect if redis disconnected or ended
        if (redis.status === "end" || redis.status === "close") {
            try {
                await redis.connect()
            } catch (connErr) {
                console.warn("⚠️ Redis auto-reconnect attempt:", connErr.message)
            }
        }

        // Checking if session id is present in Redis
        const session = await redis.get(`session-${sessionId}`)
        console.log("Session lookup:", session ? "found" : "not found")

        // Checking if session is expired
        if (!session){
            console.log(`Protect failed: Session ${sessionId} expired or not found in Redis`)
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