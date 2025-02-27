import ServerActionResponse from '@/interfaces/ServerActionResponse'
const notFoundResponse: Function = (resource: string): ServerActionResponse => {
  return {
    success: false,
    error: `404: ${resource} not found.`
  }
}
export default  notFoundResponse