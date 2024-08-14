import NextAuth from 'next-auth/next'
import authOptions from '@/utilities/authOptions'
const NextAuthHandler = NextAuth(authOptions)
export {
  NextAuthHandler as GET,
  NextAuthHandler as POST
}