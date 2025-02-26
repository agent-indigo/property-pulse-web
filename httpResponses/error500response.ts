import {NextResponse} from 'next/server'
const error500response: Function = (error: Error): NextResponse => new NextResponse(
  undefined, {
    status: 500,
    statusText: `Internal server error:\n${error.toString()}`
  }
)
export default error500response