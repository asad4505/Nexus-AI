import Redis from "ioredis"

let redisUrl = (process.env.REDIS_URL || "redis://localhost:6379").trim()

// Upstash requires TLS. Automatically upgrade redis:// to rediss:// if upstash is used
if (redisUrl.includes("upstash.io") && redisUrl.startsWith("redis://")) {
    redisUrl = redisUrl.replace("redis://", "rediss://")
}

const isTls = redisUrl.startsWith("rediss://")

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    commandTimeout: 5000,
    enableReadyCheck: false,
    retryStrategy(times) {
        // Continuous reconnect with exponential backoff — never return null (never give up)
        return Math.min(times * 100, 3000)
    },
    reconnectOnError(err) {
        const targetErrors = ["READONLY", "ECONNRESET", "ETIMEDOUT", "Connection is closed"]
        if (targetErrors.some(target => err.message.includes(target))) {
            return true // Force reconnect
        }
        return false
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