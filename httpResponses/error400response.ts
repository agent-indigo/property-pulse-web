import {NextResponse} from 'next/server'
const error400response: Function = (action: string): NextResponse => new NextResponse(
  undefined, {
    status: 400,
    statusText: `You can't ${action}.`
  }
)
export default error400response