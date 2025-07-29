import {
  createSlice,
  Slice
} from '@reduxjs/toolkit'
const unreadMessagesCountSlice: Slice = createSlice({
  name: 'unreadMessagesCount',
  initialState: {
    unread: 0
  },
  reducers: {
    getUnreadMessagesCount: (
      state,
      action
    ) => {
      state = action.payload
    }
  }
})
export const {getUnreadMessagesCount} = unreadMessagesCountSlice.actions
export default unreadMessagesCountSlice.reducer