import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {UnreadMessagesCountState} from '@/utilities/interfaces'
const initialState: UnreadMessagesCountState = {
  unreadMessagesCount: JSON.parse(localStorage.getItem('unreadMessagesCount') ?? '0')
}
const unreadMessagesCountSlice = createSlice({
  name: 'unreadMessagesCount',
  initialState,
  reducers: {
    increment: (state: UnreadMessagesCountState): void => {
      state.unreadMessagesCount++
    },
    decrement: (state: UnreadMessagesCountState): void => {
      state.unreadMessagesCount--
    },
    set: (
      state: UnreadMessagesCountState,
      action: PayloadAction<number>
    ): void => {
      state.unreadMessagesCount = action.payload
      localStorage.setItem(
        'unreadMessagesCount',
        JSON.stringify(action.payload)
      )
    }
  }
})
export const {increment, decrement, set} = unreadMessagesCountSlice.actions
export default unreadMessagesCountSlice.reducer