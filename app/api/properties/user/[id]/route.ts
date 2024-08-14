import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: {params: {id: string}}
): Promise<NextResponse> => {
  try {
    const id: string | null = params.id
    await connectToMongoDB()
    return new NextResponse(
      id ? JSON.stringify(await propertyModel.find({owner: id})) : 'User not found.',
      {status: id ? 200 : 404}
    )
  } catch (error: any) {
    return new NextResponse(
      `Error fetching properties:\n${error.toString()}`,
      {status: 500}
    )
  }
}