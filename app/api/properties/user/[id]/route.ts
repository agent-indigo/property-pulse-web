import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {
  NextRequest,
  NextResponse
} from 'next/server'
import {FlattenMaps} from 'mongoose'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
import dataResponse from '@/httpResponses/dataResponse'
import notFoundResponse from '@/httpResponses/notFoundResponse'
import serverErrorResponse from '@/httpResponses/serverErrorResponse'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: Params
): Promise<NextResponse> => {
  try {
    const id: string = params.id
    await connectToMongoDB()
    return await userModel.findById(id)
    ? dataResponse(JSON.stringify(((await propertyModel.find({
      owner: id
    }).lean()).map((
      property: FlattenMaps<PropertyDocument>
    ): PlainProperty => convertToPlainDocument(property)))))
    : notFoundResponse('User')
  } catch (error: any) {
    return serverErrorResponse(
      'retrieving user\'s properties',
      error
    )
  }
}