import mongoose from "mongoose";

const fileSchema=new mongoose.Schema({
    name:String,
    content:String
},{
    _id:false
})

const artifactSchema=new mongoose.Schema({
    id:Number,
    type:String,
    title:String,
    files:[fileSchema],

},{
    _id:false
})


const messageSchema=new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,//reference to conversation model
        ref:"Conversation"
    },
    role:{
        type:String,
        enum:["user","assistant"]//role of the user or assistant
    },
    content:String,//content of the message
    images:[String],//array of images
    artifacts:[artifactSchema]//array of artifacts

},{
    timestamps:true
})

const Message=mongoose.model("Message",messageSchema)
export default Message