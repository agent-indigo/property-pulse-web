import NextAuth from 'next-auth/next'
import authOptions from '@/utilities/authOptions'
export {dynamic} from '@/utilities/dynamic'
const NextAuthHandler = NextAuth(authOptions)
export {
  /**
   * @name    GET
   * @desc    NextAuth
   * @route   GET /api/auth/[...nextauth]
   * @access  public
   */
  NextAuthHandler as GET,
  /**
   * @name    POST
   * @desc    NextAuth
   * @route   POST /api/auth/[...nextauth]
   * @access  public
   */
  NextAuthHandler as POST
}