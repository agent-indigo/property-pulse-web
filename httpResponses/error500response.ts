import {NextResponse} from 'next/server'
const error500response: Function = (error: Error): NextResponse => {
  const {
    message,
    stack
  }: Error = error
  return new NextResponse(
    JSON.stringify({
      message: message,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined
    }), {
      status: 500
    }
  )
}
export default error500response