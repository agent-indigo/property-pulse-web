import apiSlice from '@/redux/apiSlice'
import PlainMessage from '@/types/PlainMessage'
const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    sendMessage: builder.mutation({
      query: (body: PlainMessage) => ({
        url: '/messages',
        method: 'POST',
        body
      })
    }),
    toggleMessageRead: builder.mutation({
      query: (_id: string) => ({
        url: `/messages/${_id}`,
        method: 'PATCH'
      })
    }),
    deleteMessage: builder.mutation({
      query: (_id: string) => ({
        url: `/messages/${_id}`,
        method: 'DELETE'
      })
    })
  })
})
export const {
  useSendMessageMutation,
  useToggleMessageReadMutation,
  useDeleteMessageMutation
} = messagesApiSlice