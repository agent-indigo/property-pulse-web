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
export const GET: Function = async (request: NextRequest, {params}: {params: {id: string}}): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    const property: ListedProperty | null = await propertyModel.findById(params.id)
    return property ? new NextResponse(JSON.stringify(property), {status: 200}) : new NextResponse('Property not found.', {status: 404})
  } catch (error: any) {
    return new NextResponse(`Error fetching property:\n${error.toString()}`, {status: 500})
  }
}