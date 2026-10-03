import mongoose from 'mongoose'

const connectDb = async()=>{
    try{
        const uri = process.env.AUTH_MONGODB_URI || process.env.MONGODB_URI
        if (!uri) {
            console.warn("⚠️ AUTH MONGODB_URI or MONGODB_URI not provided")
            return
        }
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        })
        console.log("✅ MongoDB Connected (Auth)")
    }
    catch(error){
        console.error(`❌ MongoDB (Auth) connection error: ${error.message}`)
    }
}

export default connectDb