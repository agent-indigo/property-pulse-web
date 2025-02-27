import ServerActionResponse from '@/interfaces/ServerActionResponse'
const unauthorizedResponse: ServerActionResponse = {
  success: false,
  error: '401: Unauthorized.'
}
export default  unauthorizedResponse