import {PROPERTIES_URL} from '@/utilities/urls'
import apiSlice from '@/slices/apiSlice'
import {ListedProperty} from '@/utilities/interfaces'
const propertiesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getProperties: builder.query({
      query: (page: number) => ({
        url: `${PROPERTIES_URL}?page=${page}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getFeaturedProperties: builder.query({
      query: () => ({
        url: `${PROPERTIES_URL}/featured`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getUserProperties: builder.query({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/user/${id}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getPropertySearchResults: builder.query({
      query: (
        location: string,
        type: string,
        page: number
      ) => ({
        url: `${PROPERTIES_URL}/search?location=${location}&type=${type}&page=${page}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getBookmarkedProperties: builder.query({
      query: () => ({
        url: `${PROPERTIES_URL}/bookmarks`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getProperty: builder.query({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getPropertyGeoCoordinates: builder.query({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}/coordinates`,
        method: 'GET'
      })
    }),
    getPropertyBookmarkedStatus: builder.query({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/bookmarks/status/${id}`,
        method: 'GET'
      })
    }),
    togglePropertyBookmarkedStatus: builder.mutation({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/bookmarks`,
        method: 'PATCH'
      })
    }),
    editProperty: builder.mutation({
      query: (
        id: string,
        update: ListedProperty
      ) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'PATCH',
        body: JSON.stringify(update)
      }),
      invalidatesTags: ['property']
    }),
    deleteProperty: builder.mutation({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['property']
    }),
    addProperty: builder.mutation({
      query: (property: FormData) => ({
        url: PROPERTIES_URL,
        method: 'POST',
        body: property
      })
    })
  })
})
export const {
  useGetPropertiesQuery,
  useGetFeaturedPropertiesQuery,
  useGetUserPropertiesQuery,
  useGetPropertySearchResultsQuery,
  useGetBookmarkedPropertiesQuery,
  useGetPropertyQuery,
  useGetPropertyGeoCoordinatesQuery,
  useGetPropertyBookmarkedStatusQuery,
  useTogglePropertyBookmarkedStatusMutation,
  useEditPropertyMutation,
  useDeletePropertyMutation,
  useAddPropertyMutation
} = propertiesApiSlice