import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import {BASE_URL} from '@/utilities/urls'
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL
  }),
  tagTypes: ['message', 'property'],
  endpoints: builder => ({})
})
export default apiSlice