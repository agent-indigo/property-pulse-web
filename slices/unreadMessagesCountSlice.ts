import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UnreadMessagesCountState} from '@/utilities/interfaces'
const initialState: UnreadMessagesCountState = {
  unreadMessagesCount: 0
}
const unreadMessagesCountSlice = createSlice({
  name: 'unreadMessagesCount',
  initialState,
  reducers: {
    incrementUnreadMessagesCount: (state: UnreadMessagesCountState): void => {
      state.unreadMessagesCount++
    },
    decrementUnreadMessagesCount: (state: UnreadMessagesCountState): void => {
      state.unreadMessagesCount--
    },
    setUnreadMessagesCount: (
      state: UnreadMessagesCountState,
      action: PayloadAction<number>
    ): void => {
      state.unreadMessagesCount = action.payload
    }
  }
})
export const {
  incrementUnreadMessagesCount,
  decrementUnreadMessagesCount,
  setUnreadMessagesCount
} = unreadMessagesCountSlice.actions
export default unreadMessagesCountSlice.reducer