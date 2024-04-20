import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import activeChatReducer from '../features/activechat/activeChat'
export const store = configureStore({
    reducer: {
        userLoginInfo: userReducer,
        activeChatInfo: activeChatReducer
    },
})