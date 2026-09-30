import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import MessageDocument from '@/src/library/types/MessageDocument'
import messageDocumentModel from '@/src/library/models/messageDocumentModel'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import success204response from '@/src/library/httpResponses/success204response'
import error401response from '@/src/library/httpResponses/error401response'
import error404response from '@/src/library/httpResponses/error404response'
import error500response from '@/src/library/httpResponses/error500response'
import success200response from '@/src/library/httpResponses/success200response'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
export const dynamic = 'force-dynamic'
/**
 * @name    DELETE
 * @desc    DELETE a message
 * @route   DELETE /api/messages/:id
 * @access  private
 */
export const DELETE = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const message: MessageDocument | null = await messageDocumentModel.findById((await params).id)
        if (message) {
          if (user.id === message.recipient.toString()) {
            await message.deleteOne()
            revalidatePath(
              '/messages',
              'page'
            )
            return success204response
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
/**
 * @name    PATCH
 * @desc    Mark a message as read or unread
 * @route   PATCH /api/messages/:id
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
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const message: MessageDocument | null = await messageDocumentModel.findById((await params).id)
        if (message) {
          if (user.id === message.recipient.toString()) {
            message.read = !message.read
            await message.save()
            revalidatePath(
              '/messages',
              'page'
            )
            return success200response(message.toObject())
          } else {
            return error401response
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