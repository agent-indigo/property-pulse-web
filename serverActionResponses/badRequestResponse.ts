import ServerActionResponse from '@/interfaces/ServerActionResponse'
const badRequestResponse: Function = (action: string): ServerActionResponse => {
  return {
    error: `You can't ${action}.`,
    success: false
  }
}
export default badRequestResponse