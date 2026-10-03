import express from "express"
import {login, logOut, verifySession} from "../controllers/auth.controller.js"


const router=express.Router()

//login route
router.post("/login",login)

//logout route
router.get("/logout",logOut)

//verify session fallback route
router.get("/verify-session/:sessionId", verifySession)

export default router