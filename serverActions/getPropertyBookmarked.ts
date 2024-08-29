'use server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
const getPropertyBookmarked: Function = async (propertyId: string): Promise<ServerActionResponse> => {
  try {
    const {error, success, sessionUser}: ServerActionResponse = await getSessionUser()
    return success && sessionUser ? {
      bookmarked: sessionUser.bookmarks.includes(propertyId),
      success: true
    } : {
      error,
      success: false
    }
  } catch (error: any) {
    return {
        error: `500: Internal Server Error:\n${error.toString()}`,
        success: false
    }
  }
}
export default getPropertyBookmarked