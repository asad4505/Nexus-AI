import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import { randomUUID } from "node:crypto";
import redis from "../../../shared/redis/redis.js"

export const login = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) {
            return res.status(400).json({ message: "No token provided" })
        }

        console.log("[AUTH LOGIN] 1. Token received, verifying...")
        const decoded = await getAuth(app).verifyIdToken(token)
        console.log("[AUTH LOGIN] 2. Token verified successfully for UID:", decoded.uid)

        console.log("[AUTH LOGIN] 3. Looking up user in MongoDB...")
        let user = await User.findOne({
            firebaseUid: decoded.uid
        }).maxTimeMS(5000)

        // User creation if new
        if (!user) {
            console.log("[AUTH LOGIN] 3b. Creating new user in MongoDB...")
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name || "Anonymous",
                email: decoded.email,
                avatar: decoded.picture
            })
        }
        console.log("[AUTH LOGIN] 4. User ready, ID:", user._id)

        // Creating session id for user
        const sessionId = randomUUID()

        console.log("[AUTH LOGIN] 5. Storing session in Redis...")
        const sessionPayload = JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan || "free",
            credits: user.credits || 100,
            totalCredits: user.totalCredits || 100,
            planExpiresAt: user.planExpiresAt
        })

        // Race Redis write against a 4s timeout so it never hangs requests
        const redisWrite = redis.set(`session-${sessionId}`, sessionPayload, "EX", 7 * 24 * 60 * 60)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Redis operation timed out after 4 seconds")), 4000)
        )

        try {
            await Promise.race([redisWrite, timeoutPromise])
            console.log("[AUTH LOGIN] 6. Session stored in Redis successfully!")
        } catch (redisErr) {
            console.warn("[AUTH LOGIN] ⚠️ Redis session write warning:", redisErr.message)
            // Even if Redis is reconnecting, we continue or report
        }

        // Setting cookie with session id
        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        console.log("[AUTH LOGIN] 7. Responding 200 OK to client!")
        return res.status(200).json({
            ...user.toObject(),
            sessionId
        })
    }
    catch (error) {
        console.error("[AUTH LOGIN] ❌ Login error:", error)
        return res.status(500).json({ message: `Login error: ${error.message || error}` })
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