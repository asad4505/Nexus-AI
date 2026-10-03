import {Annotation} from "@langchain/langgraph"
//Imports the Annotation utility from LangGraph.


//state schema for the graph
//Annotation.Root declares the top-level state object passed between every node in your graph.
export const agentState = Annotation.Root(
    {
        //Stores the incoming user query
        prompt:Annotation(),
        //Holds the generated response from an LLM node or finishing agent
        aiResponse:Annotation(),
        //Typically stores metadata, such as the identifier of which agent is currently acting, routing decisions, or agent configuration
        agent:Annotation(),

        conversationId:Annotation(),
        searchResults:Annotation(),
        images:Annotation(),
        artifacts:Annotation(),
        userId:Annotation(),
        file:Annotation()   
        
    }
)

