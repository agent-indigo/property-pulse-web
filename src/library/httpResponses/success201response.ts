import {NextResponse} from 'next/server'
const success201response: Function = (data: object): NextResponse => new NextResponse(
  JSON.stringify(data), {
    status: 201
  }
)
export default success201response