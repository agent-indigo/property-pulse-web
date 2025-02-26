import {NextResponse} from 'next/server'
const success204response: Function = (resource: string): NextResponse => new NextResponse(
  undefined, {
    status: 204,
    statusText: `${resource} deleted.`
  }
)
export default success204response