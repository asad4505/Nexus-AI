import dotenv from "dotenv"
dotenv.config()
import express from "express"

import proxy from "express-http-proxy"
import cors from "cors"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"



const port = process.env.PORT || 8000

const app = express()

// Parse comma-separated FRONTEND_URL and normalize (remove trailing slashes)
const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(url => url.trim().replace(/\/+$/, ""))
    .filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, "");

        // Allow localhost and local IP development
        if (cleanOrigin.startsWith("http://localhost:") || cleanOrigin.startsWith("http://127.0.0.1:")) {
            return callback(null, true);
        }

        // Allow configured origins
        if (configuredOrigins.includes(cleanOrigin) || configuredOrigins.includes("*")) {
            return callback(null, true);
        }

        // Automatically allow Vercel deployments (*.vercel.app)
        if (cleanOrigin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        console.warn(`[GATEWAY CORS] Blocked origin: ${origin}. Configured: ${JSON.stringify(configuredOrigins)}`);
        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
}))

app.use(cookieParser())

app.use((req, res, next) => {
    console.log(`[GATEWAY] ${req.method} ${req.url} - Origin: ${req.headers.origin || "none"}`)
    next()
})

const authService = process.env.AUTH_SERVICE || "http://127.0.0.1:8001"
const chatService = process.env.CHAT_SERVICE || "http://127.0.0.1:8002"
const agentService = process.env.AGENT_SERVICE || "http://127.0.0.1:8003"

app.use("/api/auth", proxy(authService))
app.use("/api/chat", protect, proxyWithHeader(chatService))
app.use("/api/agent", protect, proxyWithHeader(agentService))
app.get("/api/me", protect, getCurrentUser)

// Health check endpoints for Render
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

app.get("/", (req, res) => {
    res.status(200).json({
        name: "Nexus AI Gateway",
        status: "running",
        routes: ["/api/auth", "/api/chat", "/api/agent", "/api/me", "/health"]
    })
})

app.listen(port, () => {
    console.log(`[GATEWAY] Server started at port ${port}`)
})

