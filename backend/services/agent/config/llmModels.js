import dotenv from "dotenv"
dotenv.config()


import {ChatGroq} from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";


//Initialising the models

const groq = new ChatGroq({
    model:"openai/gpt-oss-120b"
})

const gemini=new ChatGoogleGenerativeAI({
    model:"gemini-1.5-flash"
})

//coding router
const openrouter=new ChatOpenRouter({
    model:"deepseek/deepseek-chat",
    temperature:0,
    maxTokens:2500
})

//returns the model based on the agent
export const getModel = async(agent)=>{
    switch (agent) {
        case "chat":
            return groq;
        case "search" :    
           return groq;
        case "coding": 
           return openrouter; 
        case "imageAnalyzer": 
           return gemini;   
    
        default:
            return groq;
    }
}