import redis from "../../shared/redis/redis.js"
//middleware to check if user is authenticated 

const protect = async (req,res,next)=>{
    try{
        const sessionId = req.cookies?.session || 
                          req.headers["x-session-id"] || 
                          (req.headers["authorization"]?.startsWith("Bearer ") ? req.headers["authorization"].split(" ")[1] : null)
        
        // checking if session id is present in the request
        if (!sessionId){
            console.log("Protect failed: No session ID found in cookies or headers")
            return res.status(400).json({message:"unauthorized"})
        }

        //checking if session id is present in the redis
        const session = await redis.get(`session-${sessionId}`)
        console.log("Session lookup:", session ? "found" : "not found")

        //checking if session is expired
        if(!session){
            console.log(`Protect failed: Session ${sessionId} expired or not found in Redis`)
            return res.status(400).json({message:"session expired"})
        }

        //extracting user data from the session
        req.user=JSON.parse(session)
        //calling next middleware
        next()
    }
    catch(error){
        return res.status(500).json({message:`protect error ${error}`})
    }
}

export default protect