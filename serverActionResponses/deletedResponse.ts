import ServerActionResponse from '@/interfaces/ServerActionResponse'
const deletedResponse: Function = (resource: string): ServerActionResponse => {
  return {
    success: true,
    message: `${resource} deleted.`
  }
}
export default deletedResponse