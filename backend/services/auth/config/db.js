import mongoose from 'mongoose'

const connectDb = async()=>{
    try{
        const uri = process.env.AUTH_MONGODB_URI || process.env.MONGODB_URI
        if (!uri) {
            console.warn("⚠️ AUTH MONGODB_URI or MONGODB_URI not provided")
            return
        }
        await mongoose.connect(uri)
        console.log("✅ MongoDB Connected (Auth)")
    }
    catch(error){
        console.log(`❌ db error ${error}`)
    }
}

export default connectDb