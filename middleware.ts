import {MiddlewareConfig} from 'next/server'
export {default} from 'next-auth/middleware'
export const middlewareConfig: MiddlewareConfig = {
  matcher: [
    '/properties/add',
    '/properties/bookmarked',
    '/profile',
    '/messages'
  ]
}