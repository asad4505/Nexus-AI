import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const isTls = redisUrl.startsWith("rediss://")

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
        const delay = Math.min(times * 100, 3000)
        return delay
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