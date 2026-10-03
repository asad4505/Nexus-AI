import { checkAgentLimit } from "../config/agentLimit.js"
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js"


//Search agent is used to search the web for the latest information
export const searchAgent = async (state) => {
    try {
        //checks the agent limit
        await checkAgentLimit(state.userId, "search")

        //invokes the tavily search tool
        const results = await searchTool.invoke({
            query: state.prompt
        })

        //deducts the credits
        await deductCredits(state.userId, "search")

        //logs the results
        console.log(results)


        //returns the state
        return {
            ...state,
            searchResults: results,
            images: results.images
        }
    } catch (error) {
        console.log(error)
        return {
            ...state,
            searchResults: [],
            images: [],
            aiResponse: error?.data?.message || "failed to search"
        }
    }
}