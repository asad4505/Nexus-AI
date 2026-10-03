//This code implements a Cache-Aside Pattern and a Sliding Window Chat Memory using Redis (ioredis) and the getMessages utility you inspected earlier.

import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../utils/getMessages.js"


export const getMemory=async (conversationId)=>{

    const key=`messages-${conversationId}`
    const cached=await redis.get(key)


    //It looks up the key messages-<conversationId> in Redis. If found, it parses the JSON string and returns the array immediately without touching the primary database/microservice.
    //This is the "hit" in the Cache-Aside pattern

    if(cached){
        return JSON.parse(cached)
    }
    

    //If the key expired or does not exist:

    //Calls getMessages(conversationId) to fetch historical messages from the primary chat microservice
    const messages=(await getMessages(conversationId)) ||[]


    //Puts the fetched messages into Redis with a Time-To-Live (TTL) of 24 hours.


    await redis.set(key,JSON.stringify(messages),"EX",24*60*60)
    
    return messages
}

//This function is responsible for updating the cache (and implicitly, the source of truth via the cache-aside pattern)

export const addMessage=async (conversationId,role,content)=>{

     //handle the error for the conversationId
     const key=`messages-${conversationId}`
     const rawMessages=await redis.get(key)

     //parse the messages
     const messages=rawMessages?JSON.parse(rawMessages):[]

     //add the messages
     messages.push({
        role,content
     })

     //sliding window memory - keeps only last 20 messages
     if(messages.length>20){
        // remove the first message
        messages.shift()
     }

     //store messages
     await redis.set(key,JSON.stringify(messages))
}

