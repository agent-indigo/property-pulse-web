import {NextResponse} from 'next/server'
export const e401response = new NextResponse(
  'Unauthorized.',
  {status: 401}
)
export const e404response: Function = (resource: string) => new NextResponse(
  `${resource} not found.`,
  {status: 404}
)
export const e500response: Function = (
  error: any,
  action: string
) => new NextResponse(
  `Error ${action}:\n${error.toString()}`,
  {status: 500}
)