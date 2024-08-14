import {NextRequest, NextResponse} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import {ListedProperty} from '@/utilities/interfaces'
/**
 * @name    GET
 * @desc    GET a single property
 * @route   GET /api/properties/:_id
 * @access  public
 */
export const GET = async (request: NextRequest, {params}: {params: {id: string}}): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    return new NextResponse(
      property ? JSON.stringify(property) : 'Property not found.',
      {status: property ? 200 : 404}
    )
  } catch (error: any) {
    return new NextResponse(
      `Error fetching property:\n${error.toString()}`,
      {status: 500}
    )
  }
}