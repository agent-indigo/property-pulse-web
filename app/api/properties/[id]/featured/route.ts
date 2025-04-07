import {
  getServerSession,
  Session
} from 'next-auth'
import {
  NextRequest,
  NextResponse
} from 'next/server'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import PropertyDocument from '@/types/PropertyDocument'
import UserDocument from '@/types/UserDocument'
import propertyDocumentModel from '@/models/propertyDocumentModel'
import userDocumentModel from '@/models/userDocumentModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export const PATCH = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession()
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const {role}: UserDocument = user
        if (role === 'root' || role === 'admin') {
          const property: PropertyDocument | null = await propertyDocumentModel.findById((await params).id)
          if (property) {
            property.is_featured = !property.is_featured
            await property.save()
            return success200response(property.toObject())
          } else {
            return error404response
          }
        } else {
          return error401response
        }
      } else {
        return error401response
      }
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}