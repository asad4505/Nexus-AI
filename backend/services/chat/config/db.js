//mongodb connection setup

import mongoose from "mongoose"

const connectDb=async ()=>{
    try {
       const uri = process.env.CHAT_MONGODB_URI || process.env.MONGODB_URI
       if (!uri) {
           console.warn("⚠️ CHAT_MONGODB_URI or MONGODB_URI not provided")
           return
       }
       await mongoose.connect(uri) 
       console.log("✅ Chat DB connected")
    } catch (error) {
       console.log(`❌ Chat DB error: ${error}`) 
    }
}

export default connectDb