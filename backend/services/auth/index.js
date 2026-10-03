import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/auth.route.js"


dotenv.config()
const port = process.env.AUTH_PORT || process.env.PORT || 8001


const app = express()
app.use(express.json())

app.use("/",router)

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "auth" })
})



// app.get("/",(req,res)=>{
//     res.json({
//         message:"Hie from Auth services"
//     })
    
// })




















app.listen(port,(req,res)=>{
    console.log(`Auth started at port ${port}`)
    connectDb()
})