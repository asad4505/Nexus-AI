import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"




//controller for creating a conversation
export const createConversation = async (req,res)=>{
    try {
    // Reads the custom x-user-id header passed downstream by your gateway proxy (proxyWithHeader
    const userId=req.headers["x-user-id"]
    console.log("userId",userId)
    
    // creates a new conversation entry in MongoDB using the userId extracted from the HTTP headers.
    const conversation=await Conversation.create({
        userId:userId
    })

    return res.status(200).json(conversation)
  } catch (error) {
     return res.status(500).json({message:`create conversation error ${error}`})
  }
}



// export const getConversations=async (req,res) => {
//   try {
//     const userId=req.headers["x-user-id"]
//     console.log("userId",userId)

//     const conversations=await Conversation.find({
//         userId:userId
//     }).sort({updatedAt:-1})
//     // Sorts the matching documents in descending order (-1) based on the updatedAt timestamp field.


//     return res.status(200).json(conversations)
//   } catch (error) {
//      return res.status(500).json({message:`get conversation error ${error}`})
//   }
// }


//fetches all active conversations owned by a specific user from MongoDB and returns them in descending order of their last update time.
export const getConversations = async (req, res) => {
  try {
    //extracting user id from the request 
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(400).json({ message: "User ID header is missing" });
    }

    //fetches all active conversations owned by a specific user from MongoDB and returns them in descending order of their last update time.
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } 
  //error handling 
  catch (error) {
    console.error("Get conversations error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


//controller for updating a conversation (title)
export const updateConversation=async (req,res) => {
  try {

    //extracting id and title from the request body
    const {id,title}=req.body
    
    //updating the conversation
    const conversation=await Conversation.findByIdAndUpdate(id,{
        title
    })

    return res.status(200).json(conversation)
  } catch (error) {
     return res.status(500).json({message:`update conversation error ${error}`})
  }
}


//controller for saving a message
export const saveMessage=async (req,res) => {
    try {
        const {conversationId,role,content,images,artifacts}=req.body
        //saving the message to the database
        const message=await Message.create({
            conversationId,
            content,
            role,
            images,
            artifacts
        })
        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({message:`save message error ${error}`})
    }
}

//controller for getting messages
export const getMessages=async (req,res) => {
    try {
        //fetching messages from the database
        const messages=await Message.find({
            conversationId:req.params.conversationId   
        })
        return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({message:`get messages error ${error}`})
    }
}


