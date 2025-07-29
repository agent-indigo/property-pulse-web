import apiSlice from '@/redux/apiSlice'
const stateApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUser: builder.query({
      query: () => ({
        url: '/auth/user',
        method: 'GET'
      })
    }),
    getUnreadMessagesCount: builder.query({
      query: () => ({
        url: '/messages/unreadCount',
        method: 'GET'
      })
    })
  })
})
export const {
  useLazyGetUserQuery,
  useGetUnreadMessagesCountQuery
} = stateApiSlice