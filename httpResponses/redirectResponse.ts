import {NextResponse} from 'next/server'
const redirectResponse: Function = (url: string): NextResponse => NextResponse.redirect(url)
export default redirectResponse