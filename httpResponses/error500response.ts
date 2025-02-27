import {NextResponse} from 'next/server'
const error500response: Function = (error: Error): NextResponse => new NextResponse(
  JSON.stringify({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : null
  }), {
    status: 500
  }
)
export default error500response