import {NextResponse} from 'next/server'
const serverErrorResponse: Function = (
  error: Error,
  action: string
): NextResponse => new NextResponse(JSON.stringify({
  message: `Error ${action}:\n${error.toString()}`,
  status: 500
}))
export default serverErrorResponse