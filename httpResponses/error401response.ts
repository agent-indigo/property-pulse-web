import {NextResponse} from 'next/server'
const error401response: NextResponse = new NextResponse(
  undefined, {
    status: 401,
    statusText: 'Unauthorized'
  }
)
export default error401response