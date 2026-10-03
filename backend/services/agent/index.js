import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/agent.route.js"

dotenv.config()

const port = process.env.AGENT_PORT || process.env.PORT || 8003

const app=express()
app.use(express.json())

app.use("/",router)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "agent" })
})
app.get("/",(req,res)=>{
    res.json({message:"hello from agent"})
})





app.listen(port,()=>{
    console.log(`agent started at ${port}`)
    connectDb()
})
