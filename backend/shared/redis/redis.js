import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

// Upstash and cloud Redis require TLS (rediss:// or upstash domain)
const isTls = redisUrl.startsWith("rediss://") || redisUrl.includes("upstash.io")

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 8000,
    commandTimeout: 5000,
    enableReadyCheck: false,
    retryStrategy(times) {
        if (times > 5) return null
        return Math.min(times * 200, 2000)
    },
    ...(isTls ? { tls: { rejectUnauthorized: false } } : {})
})

redis.on("connect", () => {
    console.log("✅ Redis connected")
})

redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err.message)
})

export default redis