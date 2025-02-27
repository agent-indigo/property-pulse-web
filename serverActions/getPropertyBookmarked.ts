'use server'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import getSessionUser from '@/serverActions/getSessionUser'
const getPropertyBookmarked: Function = async (propertyId: string): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    return success && sessionUser ? {
      bookmarked: sessionUser.bookmarks.includes(propertyId),
      success: true
    } : error ? internalServerErrorResponse(error) : unauthorizedResponse
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default getPropertyBookmarked