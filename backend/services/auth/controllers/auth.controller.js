import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import { randomUUID } from "node:crypto";
import redis from "../../../shared/redis/redis.js"

export const login = async (req,res)=>{
    try{
        const { token } = req.body
        // const decoded = await getAuth(app).verifyIdToken(token)
        console.log("TOKEN RECEIVED");

        const decoded = await getAuth(app).verifyIdToken(token);

        console.log("TOKEN VERIFIED");
        console.log(decoded);

        let user = await User.findOne({
            firebaseUid: decoded.uid
        })


        //user created
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        //creating session id for user
        const sessionId = randomUUID()


        //storing session data in redis for 7 days 
        // here "EX" means expire time in seconds 
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan || "free",
            credits: user.credits || 100,
            totalCredits: user.totalCredits || 100,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)



        //setting cookie with session id 
        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        return res.status(200).json({
            ...user.toObject(),
            sessionId
        })



    }
    catch(error){
        return res.status(500).json({ message: `login error ${error}` })
    }
}


export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session || req.headers.cookie?.split(';').map(c => c.trim()).find(c => c.startsWith('session='))?.split('=')[1]
        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }

        res.clearCookie("session")
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}