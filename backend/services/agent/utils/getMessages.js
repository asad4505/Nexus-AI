// import axios from "axios"

// export const getMessages=async (conversationId)=>{
//     try {
//        const {data}=await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversationId}`)
//        return data
//     } catch (error) {
//         console.log(error)
//         return null
//     }
// }

import axios from "axios";

export const getMessages = async (conversationId) => {

  //handle the error for the conversationId
  if (!conversationId) return [];

  try {
    const { data } = await axios.get(
      `${process.env.CHAT_SERVICE}/get-messages/${conversationId}`,
      { timeout: 5000 } // prevents hanging requests
    );
    return Array.isArray(data?.messages) ? data.messages : data || [];
  } catch (error) {
    console.error(`Failed to fetch messages for conversation ${conversationId}:`, error.message);
    return []; // returning an empty array prevents downstream crashes in .forEach() or .map()
  }
};




//this function is a service-layer helper (HTTP client) responsible for fetching the persistent chat history of a specific session from an external microservice.
//Directly returns data (usually an array of message objects, e.g., [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
//The code implements a memory retrieval utility that bridges the agent graph with a relational database (PostgreSQL) via an HTTP service.