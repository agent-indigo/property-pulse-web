import {
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_DOMAIN
  }),
  endpoints: builder => ({})
})
export default apiSlice