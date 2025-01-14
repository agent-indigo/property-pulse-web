import {NextResponse} from 'next/server'
const dataResponse: Function = (data: object): NextResponse => new NextResponse(JSON.stringify({
  data,
  status: 200
}))
export default dataResponse