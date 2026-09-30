import {NextResponse} from 'next/server'
const error400response: Function = (action: string): NextResponse => new NextResponse(
  JSON.stringify({
    message: `You can't ${action}.`
  }), {
    status: 400
  }
)
export default error400response