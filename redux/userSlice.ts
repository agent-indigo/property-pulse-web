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
    setUser: (
      state,
      action
    ) => {
      state.user = action.payload
    }
  }
})
export const {setUser} = userSlice.actions
export default userSlice.reducer