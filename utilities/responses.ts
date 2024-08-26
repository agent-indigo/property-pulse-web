import {NextResponse} from 'next/server'
export const s200: Function = (content: string) => new NextResponse(
  content,
  {status: 200}
)
export const s204: Function = (message: string) => new NextResponse(JSON.stringify({
  message,
  status: 204
}))
export const e400: Function = (action: string) => new NextResponse(JSON.stringify({
  message: `You can't ${action}.`,
  status: 400
}))
export const e401: NextResponse = new NextResponse(JSON.stringify({
  message: 'Unauthorized',
  status: 401
}))
export const e404: Function = (resource: string) => new NextResponse(JSON.stringify({
  message: `${resource} not found.`,
  status: 404
}))
export const e500: Function = (
  error: any,
  action: string
) => new NextResponse(JSON.stringify({
  message: `Error ${action}:\n${error.toString()}`,
  status: 500
}))
export const redirect: Function = (url: string) => NextResponse.redirect(url)