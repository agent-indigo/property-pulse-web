import {
  configureStore,
  EnhancedStore
} from '@reduxjs/toolkit'
import apiSlice from '@/redux/apiSlice'
import unreadMessagesCountReducer from '@/redux/unreadMessagesCountSlice'
import userReducer from '@/redux/userSlice'
const store: EnhancedStore = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userReducer,
    unreadMessagesCount: unreadMessagesCountReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development'
})
export default store