import {MESSAGES_URL} from '@/utilities/urls'
import apiSlice from '@/slices/apiSlice'
import {
  InquiryMessage,
  ResourceStatusResponse,
  UnreadCountResponse
} from '@/utilities/interfaces'
const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getMessages: builder.query<InquiryMessage[], void>({
      query: () => ({
        url: MESSAGES_URL,
        method: 'GET'
      }),
      providesTags: ['message']
    }),
    getUnreadMessagesCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: `${MESSAGES_URL}/unreadCount`,
        method: 'GET'
      })
    }),
    toggleMessageReadStatus: builder.mutation<ResourceStatusResponse, string>({
      query: (id: string) => ({
        url: `${MESSAGES_URL}/${id}`,
        method: 'PATCH'
      }),
      invalidatesTags: ['message']
    }),
    deleteMessage: builder.mutation<ResourceStatusResponse, string>({
      query: (id: string) => ({
        url: `${MESSAGES_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['message']
    }),
    sendMessage: builder.mutation<ResourceStatusResponse, InquiryMessage>({
      query: (message: InquiryMessage) => ({
        url: MESSAGES_URL,
        method: 'POST',
        body: JSON.stringify(message)
      })
    })
  })
})
export const {
  useGetMessagesQuery,
  useGetUnreadMessagesCountQuery,
  useToggleMessageReadStatusMutation,
  useDeleteMessageMutation,
  useSendMessageMutation
} = messagesApiSlice