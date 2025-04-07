import NextAuth from 'next-auth/next'
import authOpts from '@/config/authOpts'
export const dynamic = 'force-dynamic'
export const {
  /**
   * @name    GET
   * @desc    NextAuth
   * @route   GET /api/auth/[...nextauth]
   * @access  public
   */
  GET,
  /**
   * @name    POST
   * @desc    NextAuth
   * @route   POST /api/auth/[...nextauth]
   * @access  public
   */
  POST
} = NextAuth(authOpts)