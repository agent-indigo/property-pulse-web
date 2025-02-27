import {NextResponse} from 'next/server'
const error404response: NextResponse = new NextResponse(
  undefined, {
    status: 404
  }
)
export default error404response