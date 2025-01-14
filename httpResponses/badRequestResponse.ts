import {NextResponse} from 'next/server'
const badRequestResponse: Function = (action: string): NextResponse => new NextResponse(JSON.stringify({
  message: `You can't ${action}.`,
  status: 400
}))
export default badRequestResponse