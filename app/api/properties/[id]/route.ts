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
    await connectToMongoDB() as void
    const property: ListedProperty | null = await propertyModel.findById(params.id as string) as ListedProperty
    if (property as ListedProperty) {
      return new NextResponse(JSON.stringify(property as ListedProperty) as string, {status: 200 as number}) as NextResponse
    } else {
      return new NextResponse('Property not found.' as string, {status: 404 as number}) as NextResponse
    }
  } catch (error: any) {
    return new NextResponse(`Error fetching property:\n${error.toString() as string}` as string, {status: 500 as number}) as NextResponse
  }
}