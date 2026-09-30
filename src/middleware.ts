import {MiddlewareConfig} from 'next/server'
export {default} from 'next-auth/middleware'
export const config: MiddlewareConfig = {
  matcher: [
    '/messages',
    '/profile',
    '/properties/add',
    '/properties/bookmarks',
    '/properties/:id/edit',
    '/properties/:id/images/add',
    '/properties/:id/images/delete'
  ]
}