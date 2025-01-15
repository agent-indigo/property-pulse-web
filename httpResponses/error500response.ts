import {NextResponse} from 'next/server'
const error500response: Function = (
  action: string,
  error: Error
): NextResponse => new NextResponse(
  undefined, {
    status: 500,
    statusText: `Internal server error ${action}:\n${error.message}`
  }
)
export default error500response