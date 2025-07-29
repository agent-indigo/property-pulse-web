import apiSlice from '@/redux/apiSlice'
import EditPropertyMutation from '@/types/EditPropertyMutation'
import PlainMessage from '@/types/PlainMessage'
import PlainProperty from '@/types/PlainProperty'
const actionsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    addProperty: builder.mutation({
      query: (body: PlainProperty) => ({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties`,
        method: 'POST',
        body
      })
    }),
    editProperty: builder.mutation({
      query: ({
        _id,
        body
      }: EditPropertyMutation) => ({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}`,
        method: 'PATCH',
        body
      })
    }),
    sendMessage: builder.mutation({
      query: (body: PlainMessage) => ({
        url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/messages`,
        method: 'POST',
        body
      })
    })
  })
})
export const {
  useAddPropertyMutation,
  useEditPropertyMutation,
  useSendMessageMutation
} = actionsApiSlice