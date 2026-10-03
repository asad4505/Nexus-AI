import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import redis from "../../../shared/redis/redis.js"

//This function orchestrates the entire multi-agent workflow.
export const agent=async (req,res,next) => {

    //handling the request
    try {

        //Extracts the prompt text, the session identifier (conversationId), and an optional manual override for agent
        const {prompt,conversationId,agent}=req.body
        //multer file
        const file=req.file
        console.log("file",file)
        //Reads x-user-id from headers (standard pattern when behind an API gateway or reverse proxy) to enforce per-user agent rate limits and billing
        const userId=req.headers["x-user-id"]

        //save the message to the database
        //calling the save message service
        const chatServiceUrl = process.env.CHAT_SERVICE || "http://127.0.0.1:8002"
        await axios.post(`${chatServiceUrl}/save-message`,{
            conversationId,role:"user",content:prompt
        })
        
        //invoke the graph
        //result contains the accumulated output channels: aiResponse, agent, plus any additional channels returned by worker agents (such as images or artifacts).
        const result=await graph.invoke({
            prompt,conversationId,agent,userId,file
        })


        console.log("result",result)


        // saving the user message to the database
        await addMessage(conversationId,"user",prompt)
        //saving the assistant response to the database
        await addMessage(conversationId,"assistant",result.aiResponse)
        //calling the save message service
        await axios.post(`${chatServiceUrl}/save-message`,{
            conversationId,role:"assistant",content:result?.aiResponse,images:result?.images,artifacts:result?.artifacts
        })

        //sending the response to the client
        return res.status(200).json({
            answer:result?.aiResponse,
            images:result?.images,
            artifacts:result?.artifacts
        })
       
    } 
    //handling the error
    catch (error) {
       next(error)
    }
}






// [Client HTTP Request]
//         │
//         ▼
// 1. Extract metadata (prompt, conversationId, agent, file, userId)
//         │
//         ▼
// 2. Persist user message to primary chat microservice (PostgreSQL/MongoDB)
//         │
//         ▼
// 3. Invoke LangGraph (`graph.invoke(...)`)
//         │
//         ▼
// 4. Cache conversation turns in Redis memory (`addMessage`)
//         │
//         ▼
// 5. Persist assistant output (text, images, artifacts) to chat microservice
//         │
//         ▼
// [HTTP 200 JSON Response to Client]