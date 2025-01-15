import {NextResponse} from 'next/server'
const success201response: Function = (
  data: object,
  type: string
): NextResponse => new NextResponse(
  JSON.stringify(data), {
    status: 201,
    statusText: type.toLowerCase() === 'message' ? 'Message sent' : `${type} created`
  }
)
export default success201response