import mongoose from "mongoose"

const connectDb=async ()=>{
    try {
       const uri = process.env.AGENT_MONGODB_URI || process.env.MONGODB_URI
       if (!uri) {
           console.warn("⚠️ AGENT_MONGODB_URI or MONGODB_URI not provided")
           return
       }
       await mongoose.connect(uri) 
       console.log("✅ Agent DB connected")
    } catch (error) {
       console.log(`❌ Agent DB error: ${error}`) 
    }
}

export default connectDb