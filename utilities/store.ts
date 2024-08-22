import {configureStore} from '@reduxjs/toolkit'
import apiSlice from '@/slices/apiSlice'
import unreadMessagesCountSliceReducer from '@/slices/unreadMessagesCountSlice'
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    unreadMessagesCount: unreadMessagesCountSliceReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development'
})
export default store