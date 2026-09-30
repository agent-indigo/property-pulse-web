import {NextResponse} from 'next/server'
const success204response: NextResponse = new NextResponse(
  undefined, {
    status: 204
  }
)
export default success204response