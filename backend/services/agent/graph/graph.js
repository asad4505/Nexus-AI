//takes a user query, determines which specialized agent should handle it, executes that agent, and terminates the graph

import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRag } from "../agents/pdfRag.agent.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.agent.js";

//Create the workflow
//Instantiates a new computational graph bound to the agentState schema you defined earlier ({ prompt, aiResponse, agent }).
//Every node registered in this graph receives this shared state and outputs partial updates to it
const workflow = new StateGraph(agentState)


//addition of the nodes


//inspects state.prompt and decides which downstream agent should handle the request, writing its decision into state.agent
workflow.addNode("router",router)


workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("vision",visionAgent)
workflow.addNode("pdfRag",pdfRag)
workflow.addNode("imageAnalyzer",imageAnalyzer)


//connecting the  start agent with the router agent
//start and end node are already connected in the langgraph 

workflow.addEdge("__start__","router")

//conditional edge for the router
//It determines the next node to execute based on the value of the agent field in the current state.
//Once the router finishes running and populates state.agent, LangGraph evaluates the routing function

workflow.addConditionalEdges("router",(state)=>{
   switch (state.agent) {
    case "chat":
     return "chat";
    case "search":
     return "search";
    case "coding":
     return "coding";
    case "pdf":
     return "pdf";
    case "ppt":
     return "ppt";
    case "vision":
     return "vision";
    case "pdfRag":
     return "pdfRag";
     case "imageAnalyzer":
     return "imageAnalyzer";  
    default:
     return "chat"
   }
},{
   //mapping the agent name to the node
   //registers the allowed target node names so LangGraph can validate the graph structure during compilation
   chat:"chat",
   search:"search",
   coding:"coding",
   pdf:"pdf" ,
   ppt:"ppt" ,
   vision:"vision",
   pdfRag:"pdfRag",
   imageAnalyzer :"imageAnalyzer"
})

//searchAgent retrieves web results, appends them to state, and passes the state to chatAgent to synthesize a natural-language answer
workflow.addEdge("search","chat")

workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("vision","__end__")
workflow.addEdge("pdfRag","__end__")
workflow.addEdge("imageAnalyzer","__end__")


//Validates all edges, starts, and ends for deadlocks or missing references.
export const graph=workflow.compile()