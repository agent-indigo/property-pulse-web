import {NextResponse} from 'next/server'
const unauthorizedResponse: NextResponse = new NextResponse(JSON.stringify({
  message: 'Unauthorized',
  status: 401
}))
export default unauthorizedResponse