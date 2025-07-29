import apiSlice from '@/redux/apiSlice'
import PlainProperty from '@/types/PlainProperty'
import PropertyMutation from '@/types/PropertyMutation'
const propertiesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
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
      }: PropertyMutation) => ({
        url: `/properties/${_id}`,
        method: 'PATCH',
        body
      })
    }),
    deleteProperty: builder.mutation({
      query: (_id: string) => ({
        url: `/properties/${_id}`,
        method: 'DELETE'
      })
    }),
    togglePropertyBookmarked: builder.mutation({
      query: (_id: string) => ({
        url: `/properties/bookmarked/status/${_id}`,
        method: 'PATCH'
      })
    }),
    addPropertyImages: builder.mutation({
      query: ({
        _id,
        body
      }: PropertyMutation) => ({
        url: `/properties/${_id}/images`,
        method: 'POST',
        body
      })
    }),
    deletePropertyImage: builder.mutation({
      query: ({
        _id,
        imageId
      }) => ({
        url: `/properties/${_id}/images/${imageId}`,
        method: 'DELETE'
      })
    }),
    geolocateProperty: builder.query({
      query: (_id: string) => ({
        url: `/properties/${_id}/geolocate`,
        method: 'GET'
      })
    })
  })
})
export const {
  useAddPropertyMutation,
  useEditPropertyMutation,
  useDeletePropertyImageMutation,
  useAddPropertyImagesMutation,
  useDeletePropertyMutation,
  useTogglePropertyBookmarkedMutation,
  useLazyGeolocatePropertyQuery
} = propertiesApiSlice