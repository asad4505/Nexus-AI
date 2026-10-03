import fs, { stat } from "fs"
import {PDFParse} from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { vectorStore } from "../config/vectorDb.js"
import { getModel } from "../config/llmModels.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"


export const pdfRag=async (state)=>{
   try {
    await checkAgentLimit(state.userId,"pdf")

      //reading the pdf file from the buffer
      const buffer=fs.readFileSync(state.file.path)

      //parsing the pdf file
      const pdf=new PDFParse({
        data:buffer
      })

      //getting text from pdf
      const result=await pdf.getText()
      const text=result.text

      //splitting the text into chunks
      const spilliter=new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200
      })


      //creating documents
      const docs=await spilliter.createDocuments([text])
      const collectionName=`pdf-${Date.now()}`;

      //storing documents in vector database
      const store=await vectorStore(docs,collectionName)

      //searching for similar documents
      const relevantDocs=await store.similaritySearch(state.prompt,5)
      //extracting the text from the documents
      const context=relevantDocs.map(d=>d.pageContent).join("\n\n")
      
      //invoking the llm to generate the response
      const llm=await getModel("pdf-rag")

      //prompt engineering
       const messages=[
        new SystemMessage(`You are Nexus AI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),

//user prompt with context
new HumanMessage(`
    Context:${context}
     Question:${state.prompt}
    `)
       ]


      const response=await llm.invoke(messages)
      await deductCredits(state.userId,"pdf")
      console.log(response)
      return {
        ...state,
        aiResponse:response.content
      }



   } catch (error) {
    console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to analyze pdf"
        }
   }finally{
         fs.unlinkSync(state.file.path)
   }


}