import {
  NextRequest,
  NextResponse
} from 'next/server'
import {ObjectId} from 'mongoose'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import PropertyDocument from '@/interfaces/PropertyDocument'
import UserDocument from '@/interfaces/UserDocument'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import success200response from '@/httpResponses/success200response'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import error404response from '@/httpResponses/error404response'
import authOpts from '@/config/authOpts'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Check if a property is bookmarked
 * @route   GET /api/properties/bookmarks/status/:id
 * @access  private
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      return user ? success200response({
        bookmarked: user.toObject().bookmarks.includes((await params).id)
      }) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}
/**
 * @name    PATCH
 * @desc    Add or remove a bookmark
 * @route   PATCH /api/properties/bookmarked/status/:id
 * @access  private
 */
export const PATCH = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const property: PropertyDocument | null = await propertyModel.findById((await params).id)
        if (property) {
          if (property.get('owner').toString() === user.get('id')) {
            const id: string = property.get('id')
            const bookmarked: boolean = user.toObject().bookmarks.includes(id)
            bookmarked ? user.set(
              'bookmarks',
              user.get('bookmarks').filter((bookmark: ObjectId): boolean => bookmark.toString() !== id)
            ) : user.bookmarks.push(property.get(id))
            await user.save()
            revalidatePath(
              '/properties/bookmarks',
              'page'
            )
            return success200response({
              bookmarked: !bookmarked
            })
          } else {
            return error401response
          }
        } else {
          return error404response
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