import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import {e404response, e500response} from '@/utilities/apiResponses'
import {ApiParams, RegisteredUser} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: ApiParams
): Promise<NextResponse> => {
  try {
    const id: string = params.id
    await connectToMongoDB()
    const user: RegisteredUser | null = await userModel.findById(id)
    return user ? new NextResponse(
      JSON.stringify(await propertyModel.find({owner: id})),
      {status: 200}
    ) : e404response('User')
  } catch (error: any) {
    return e500response(
      'fetching properties',
      error
    )
  }
}