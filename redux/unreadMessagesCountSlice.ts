import {
  createSlice,
  Slice
} from '@reduxjs/toolkit'
const unreadMessagesCountSlice: Slice = createSlice({
  name: 'unreadMessagesCount',
  initialState: 0,
  reducers: {
    setUnreadMessagesCount: (
      state,
      action
    ) => {
      state.unreadMessagesCount = action.payload.unreadMessagesCount
    }
  }
})
export const {setUnreadMessagesCount} = unreadMessagesCountSlice.actions
export default unreadMessagesCountSlice.reducer