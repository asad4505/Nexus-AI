import { getModel } from "../config/llmModels.js"

export const router = async (state) => {

  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent
    }
  }

  //multer file routing
  if(state.file){
//pdf file routing
if(state.file.mimetype==="application/pdf"){
    return {
      ...state,
      agent:"pdfRag"
    }
  }

    if(state.file.mimetype.startsWith("image/")){
    return {
      ...state,
      agent:"imageAnalyzer"
    }
  }
  }

  


  const llm = await getModel("router")
  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision 

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
  Generate image,
  create image

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:
 ${state.prompt}
`

  const response = await llm.invoke(prompt)

  return {
    ...state,
    agent: response.content
      .trim()
      .toLowerCase()
  }



}


// import { z } from "zod";
// import { getModel } from "../config/llmModels.js";

// // 1. Define the strictly allowed agents matching your graph's conditional edges
// const RouterSchema = z.object({
//   agent: z
//     .enum([
//       "chat",
//       "search",
//       "coding",
//       "pdf",
//       "ppt",
//       "vision",
//       "pdfRag",
//       "imageAnalyzer",
//     ])
//     .describe("The name of the agent best suited to handle the user query."),
//   reasoning: z
//     .string()
//     .optional()
//     .describe("Brief 1-sentence reasoning for the routing decision."),
// });

// export const router = async (state) => {
//   const baseLlm = getModel("router");

//   // 2. Bind the structured output schema to the model
//   const structuredLlm = baseLlm.withStructuredOutput(RouterSchema);

//   const prompt = `You are an agent supervisor that routes user queries to the best specialized agent.

// Available agents and when to use them:
// - chat: General conversation, greetings, explanations, broad learning questions.
// - search: Current events, latest news, recent developments, real-time web lookups.
// - coding: Code generation, debugging, software architecture, API questions, scripts.
// - pdf: Creating or modifying PDF documents.
// - ppt: Creating or modifying PowerPoint presentations.
// - vision: Generating or creating new images from text.
// - pdfRag: Querying, reading, or retrieving information from existing uploaded PDF documents.
// - imageAnalyzer: Understanding, inspecting, or describing user-provided images.

// User Query:
// ${state.prompt}`;

//   // 3. Invoke the model - returns an object conforming to RouterSchema
//   const result = await structuredLlm.invoke(prompt);

//   // 4. Return only the state fields to update (LangGraph automatically merges)
//   return {
//     agent: result.agent,
//   };
// };