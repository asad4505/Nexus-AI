import { createSlice } from "@reduxjs/toolkit";

//slice for managing user data
const userSlice=createSlice({
    name:"user",//name of the slice
    initialState:{
      userData:null,//initial state for user data
    },
    reducers:{
        setUserdata:(state,action)=>{
            state.userData=action.payload 
        }//reducer for setting user data
    }
   
})
//exporting the slice

export const {setUserdata}=userSlice.actions 
export default userSlice.reducer

