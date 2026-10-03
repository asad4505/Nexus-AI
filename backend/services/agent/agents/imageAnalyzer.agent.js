
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import fs from "fs/promises"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"


export const imageAnalyzer =async (state) => {

    //checking the agent limit
    await checkAgentLimit(state.userId,"image")

    try {
        //getting the llm model
        const llm = await getModel("imageAnalyzer")

        //reading the image file in async mode
        const imageBuffer = await fs.readFile(state.file.path)
        //converting the image to base64
        const base64Image = imageBuffer.toString("base64")

        const messages = [
            new SystemMessage(
                `You are NEXUSAI image analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.
`
            ),
            new HumanMessage(
                {
                    content: [
                        {
                            type: "text",
                            text: state.prompt || "analyze the image"
                        },
                        {
                            type:"image_url",
                            "image_url":{
                                url:`data:${state.file.mimetype};base64,${base64Image}`
                            }
                        }
                    ]
                }

            )
        ]

const response=await llm.invoke(messages)
 await deductCredits(state.userId,"vision")
return {
    ...state,
    aiResponse:response.content
}

    } 
    
    //catch block
    catch (error) {
       console.log(error)
        //sending the error message to the user
        return {
            ...state,
            aiResponse:error?.data?.message || "failed to analyze image"
        
}
    }
    finally{
      await fs.unlink(state.file.path)
    }
}