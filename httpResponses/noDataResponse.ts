import {NextResponse} from 'next/server'
const noDataResponse: Function = (message: string): NextResponse => new NextResponse(JSON.stringify({
  message,
  status: 204
}))
export default noDataResponse