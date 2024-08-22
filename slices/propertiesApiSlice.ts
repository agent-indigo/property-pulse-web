import {PROPERTIES_URL} from '@/utilities/urls'
import apiSlice from '@/slices/apiSlice'
import {
  GeoCodingResponse,
  GetPropertiesResponse,
  ListedProperty,
  PropertySearchParams,
  ResourceStatusResponse
} from '@/utilities/interfaces'
const propertiesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProperties: builder.query<GetPropertiesResponse, number | undefined>({
      query: (page?: number) => ({
        url: `${PROPERTIES_URL}?page=${page}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getFeaturedProperties: builder.query<ListedProperty[], void>({
      query: () => ({
        url: `${PROPERTIES_URL}/featured`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getUserProperties: builder.query<ListedProperty[], string>({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/user/${id}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getPropertySearchResults: builder.query<GetPropertiesResponse, PropertySearchParams>({
      query: ({
        location,
        type,
        page
      }) => ({
        url: `${PROPERTIES_URL}/search?location=${location}&type=${type}&page=${page}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getBookmarkedProperties: builder.query<ListedProperty[], void>({
      query: () => ({
        url: `${PROPERTIES_URL}/bookmarks`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getProperty: builder.query<ListedProperty, string>({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'GET'
      }),
      providesTags: ['property']
    }),
    getPropertyGeoCoordinates: builder.query<GeoCodingResponse, string>({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}/coordinates`,
        method: 'GET'
      })
    }),
    getPropertyBookmarkedStatus: builder.query<ResourceStatusResponse, string>({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/bookmarks/status/${id}`,
        method: 'GET'
      })
    }),
    togglePropertyBookmarkedStatus: builder.mutation<ResourceStatusResponse, string>({
      query: (propertyId: string) => ({
        url: `${PROPERTIES_URL}/bookmarks`,
        method: 'PATCH',
        body: JSON.stringify({propertyId})
      })
    }),
    editProperty: builder.mutation<ResourceStatusResponse, any>({
      query: (
        id?: string,
        update?: ListedProperty
      ) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'PATCH',
        body: JSON.stringify(update)
      }),
      invalidatesTags: ['property']
    }),
    deleteProperty: builder.mutation<ListedProperty[], string>({
      query: (id: string) => ({
        url: `${PROPERTIES_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['property']
    }),
    addProperty: builder.mutation<void, FormData>({
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