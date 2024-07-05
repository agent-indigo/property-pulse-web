import {NextApiHandler} from 'next'
import {AuthOptions} from 'next-auth'
import NextAuth from 'next-auth/next'
import authOptions from '@/utilities/authOptions'
const NextAuthHandler: NextApiHandler = NextAuth(authOptions as AuthOptions) as NextApiHandler
export {NextAuthHandler as GET, NextAuthHandler as POST}