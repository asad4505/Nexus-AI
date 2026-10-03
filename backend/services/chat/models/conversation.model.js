//model for storing conversation data
import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    title:{
        type:String,
        default:"New Chat"//default title
    },
    userId:{
        type:String // user id
    }
},{
    timestamps:true
})

const Conversation=mongoose.model("Conversation",conversationSchema)
export default Conversation