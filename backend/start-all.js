import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import dotenv from "dotenv"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load local environment files if present
const envFiles = [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, "gateway/.env"),
    path.resolve(__dirname, "services/auth/.env"),
    path.resolve(__dirname, "services/chat/.env"),
    path.resolve(__dirname, "services/agent/.env"),
]

for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
        dotenv.config({ path: envFile })
    }
}

// Port Configuration
// On Render, $PORT is dynamically provided for the public web service (Gateway)
const GATEWAY_PORT = process.env.PORT || 8000
const AUTH_PORT = process.env.AUTH_PORT || 8001
const CHAT_PORT = process.env.CHAT_PORT || 8002
const AGENT_PORT = process.env.AGENT_PORT || 8003

// Downstream internal service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE || `http://127.0.0.1:${AUTH_PORT}`
const CHAT_SERVICE = process.env.CHAT_SERVICE || `http://127.0.0.1:${CHAT_PORT}`
const AGENT_SERVICE = process.env.AGENT_SERVICE || `http://127.0.0.1:${AGENT_PORT}`

console.log("==================================================")
console.log("🚀 Starting Nexus AI Unified Backend Architecture")
console.log("==================================================")
console.log(`📡 Public Gateway Port : ${GATEWAY_PORT} (Render entrypoint)`)
console.log(`🔒 Internal Auth Port   : ${AUTH_PORT}`)
console.log(`💬 Internal Chat Port   : ${CHAT_PORT}`)
console.log(`🤖 Internal Agent Port  : ${AGENT_PORT}`)
console.log("==================================================")

const services = [
    {
        name: "AUTH",
        color: "\x1b[33m", // Yellow
        cwd: path.resolve(__dirname, "services/auth"),
        script: "index.js",
        env: {
            PORT: String(AUTH_PORT),
        }
    },
    {
        name: "CHAT",
        color: "\x1b[36m", // Cyan
        cwd: path.resolve(__dirname, "services/chat"),
        script: "index.js",
        env: {
            PORT: String(CHAT_PORT),
        }
    },
    {
        name: "AGENT",
        color: "\x1b[35m", // Magenta
        cwd: path.resolve(__dirname, "services/agent"),
        script: "index.js",
        env: {
            PORT: String(AGENT_PORT),
            AUTH_SERVICE,
            CHAT_SERVICE,
        }
    },
    {
        name: "GATEWAY",
        color: "\x1b[32m", // Green
        cwd: path.resolve(__dirname, "gateway"),
        script: "index.js",
        env: {
            PORT: String(GATEWAY_PORT),
            AUTH_SERVICE,
            CHAT_SERVICE,
            AGENT_SERVICE,
        }
    }
]

const runningProcesses = []

const startService = (service) => {
    const combinedEnv = {
        ...process.env,
        ...service.env,
    }

    const child = spawn(process.execPath, [service.script], {
        cwd: service.cwd,
        env: combinedEnv,
        stdio: ["inherit", "pipe", "pipe"],
    })

    runningProcesses.push({ name: service.name, child })

    const resetColor = "\x1b[0m"
    const prefix = `${service.color}[${service.name}]${resetColor} `

    child.stdout.on("data", (data) => {
        const lines = data.toString().trimEnd().split("\n")
        for (const line of lines) {
            console.log(`${prefix}${line}`)
        }
    })

    child.stderr.on("data", (data) => {
        const lines = data.toString().trimEnd().split("\n")
        for (const line of lines) {
            console.error(`${prefix}\x1b[31m${line}${resetColor}`)
        }
    })

    child.on("close", (code) => {
        console.log(`${prefix}Process exited with code ${code}`)
    })

    child.on("error", (err) => {
        console.error(`${prefix}Failed to start process:`, err)
    })
}

// Start all services
for (const service of services) {
    startService(service)
}

// Graceful shutdown
const shutdown = () => {
    console.log("\n🛑 Stopping all Nexus AI services...")
    for (const { name, child } of runningProcesses) {
        try {
            child.kill("SIGTERM")
        } catch (err) {
            // ignore
        }
    }
    process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
