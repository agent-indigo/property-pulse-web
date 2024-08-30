import {NextRequest, NextResponse} from 'next/server'
import {FlattenMaps} from 'mongoose'
import {e500, s200} from '@/utilities/responses'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PropertyDocument from '@/interfaces/PropertyDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    return s200(JSON.stringify((await propertyModel
      .find({is_featured: true})
      .lean()
    ).map((property: FlattenMaps<PropertyDocument>): PlainProperty => convertToPlainDocument(property))))
  } catch (error: any) {
    return e500(
      'retrieving featured properties',
      error
    )
  }
}