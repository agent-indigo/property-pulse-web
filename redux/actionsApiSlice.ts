import apiSlice from '@/redux/apiSlice'
import EditPropertyMutation from '@/types/EditPropertyMutation'
import PlainMessage from '@/types/PlainMessage'
import PlainProperty from '@/types/PlainProperty'
const actionsApiSlice = apiSlice.injectEndpoints({
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
    }),
    addProperty: builder.mutation({
      query: (body: PlainProperty) => ({
        url: '/properties',
        method: 'POST',
        body
      })
    }),
    editProperty: builder.mutation({
      query: ({
        _id,
        body
      }: EditPropertyMutation) => ({
        url: `/properties/${_id}`,
        method: 'PATCH',
        body
      })
    }),
    sendMessage: builder.mutation({
      query: (body: PlainMessage) => ({
        url: '/messages',
        method: 'POST',
        body
      })
    })
  })
})
export const {
  useGetUserQuery,
  useGetUnreadMessagesCountQuery,
  useAddPropertyMutation,
  useEditPropertyMutation,
  useSendMessageMutation
} = actionsApiSlice