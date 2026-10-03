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

        // Save the user message to the database (non-blocking for AI response)
        const chatServiceUrl = process.env.CHAT_SERVICE || "http://127.0.0.1:8002"
        try {
            await axios.post(`${chatServiceUrl}/save-message`, {
                conversationId, role: "user", content: prompt
            }, { timeout: 3000 })
        } catch (saveErr) {
            console.warn("⚠️ Could not save user message to chat service:", saveErr.message)
        }

        // Invoke the graph
        console.log(`[AGENT] Invoking graph for prompt: "${prompt?.slice(0, 30)}..." with agent: ${agent || "auto"}`)
        const result = await graph.invoke({
            prompt, conversationId, agent, userId, file
        })

        console.log("[AGENT] Graph completed. aiResponse length:", result?.aiResponse?.length || 0)

        // Save conversation history to memory and DB asynchronously
        try {
            await addMessage(conversationId, "user", prompt)
            if (result?.aiResponse) {
                await addMessage(conversationId, "assistant", result.aiResponse)
            }
            await axios.post(`${chatServiceUrl}/save-message`, {
                conversationId,
                role: "assistant",
                content: result?.aiResponse,
                images: result?.images,
                artifacts: result?.artifacts
            }, { timeout: 3000 })
        } catch (postSaveErr) {
            console.warn("⚠️ Could not save assistant response to chat service:", postSaveErr.message)
        }

        // Sending the response to the client
        return res.status(200).json({
            answer: result?.aiResponse || "I didn't receive any response from the AI model.",
            images: result?.images || [],
            artifacts: result?.artifacts || []
        })

    } 
    // Handling errors
    catch (error) {
       console.error("[AGENT ERROR]:", error)
       return res.status(500).json({
           answer: `Agent Error: ${error?.message || "Internal server error"}`,
           error: error.message
       })
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