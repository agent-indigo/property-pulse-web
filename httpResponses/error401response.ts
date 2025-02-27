import {NextResponse} from 'next/server'
const error401response: NextResponse = new NextResponse(
  undefined, {
    status: 401
  }
)
export default error401response