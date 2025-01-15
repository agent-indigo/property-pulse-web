import {
  NextRequest,
  NextResponse
} from 'next/server'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {id}: any = await params
    await connectToMongoDB()
    return await userModel.findById(id) ? new NextResponse(
      JSON.stringify(await propertyModel.find({
        owner: id
      })), {
        status: 200,
        statusText: 'OK'
      }
    ) : new NextResponse(
      undefined, {
        status: 404,
        statusText: 'User not found'
      }
    )
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}