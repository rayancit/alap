import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    active: null
}

export const activeChatSlice = createSlice({
    name: 'activeChatInfo',
    initialState,
    reducers: {
        addChatInfo: (state, action) => {
            state.active = action.payload
        }
    },
})

export const { addChatInfo } = activeChatSlice.actions
export default activeChatSlice.reducer