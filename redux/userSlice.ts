import {
  createSlice,
  Slice
} from '@reduxjs/toolkit'
const userSlice: Slice = createSlice({
  name: 'user',
  initialState: {
    _id: null,
    image: null
  },
  reducers: {
    getUser: (
      state,
      action
    ) => {
      state = action.payload
    }
  }
})
export const {getUser} = userSlice.actions
export default userSlice.reducer