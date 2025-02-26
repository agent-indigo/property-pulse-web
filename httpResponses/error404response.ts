import {NextResponse} from 'next/server'
const error404response: Function = (resource: string): NextResponse => new NextResponse(
  undefined, {
    status: 404,
    statusText: `${resource} not found.`
  }
)
export default error404response