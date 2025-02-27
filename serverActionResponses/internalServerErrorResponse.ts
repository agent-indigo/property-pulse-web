import ServerActionResponse from '@/interfaces/ServerActionResponse'
const internalServerErrorResponse: Function = (error: Error): ServerActionResponse => {
  return {
    success: false,
    error: `500: Internal server error:\n${error.message}`,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }
}
export default internalServerErrorResponse