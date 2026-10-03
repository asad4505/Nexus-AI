//redux toolkit for managing user data
import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice"
import conversationReducer from "./conversationSlice"
import messageReducer from "./messageSlice"

//setting up store for redux
export const store = configureStore({
  reducer: {
    user:userReducer,
    conversation:conversationReducer,
    message:messageReducer
  },
})