import {NextResponse} from 'next/server'
const notFoundResponse: Function = (
  resource: string
): NextResponse => new NextResponse(JSON.stringify({
  message: `${resource} not found.`,
  status: 404
}))
export default notFoundResponse