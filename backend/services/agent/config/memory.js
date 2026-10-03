//This code implements a Cache-Aside Pattern and a Sliding Window Chat Memory using Redis (ioredis) and the getMessages utility you inspected earlier.

import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMessages.js"


export const getMemory=async (conversationId)=>{
    const key=`messages-${conversationId}`
    try {
        const cached = await redis.get(key)
        if (cached) {
            return JSON.parse(cached)
        }
    } catch (err) {
        console.warn("⚠️ Redis getMemory failed, reading directly from chat service:", err.message)
    }

    // Calls getMessages(conversationId) to fetch historical messages from the primary chat microservice
    const messages = (await getMessages(conversationId)) || []

    try {
        await redis.set(key, JSON.stringify(messages), "EX", 24 * 60 * 60)
    } catch {}

    return messages
}

// Updates cache with sliding window
export const addMessage=async (conversationId,role,content)=>{
    try {
        const key=`messages-${conversationId}`
        const rawMessages=await redis.get(key)
        const messages=rawMessages?JSON.parse(rawMessages):[]

        messages.push({ role, content })

        if(messages.length>20){
            messages.shift()
        }

        await redis.set(key,JSON.stringify(messages))
    } catch (err) {
        console.warn("⚠️ Redis addMessage failed:", err.message)
    }
}

