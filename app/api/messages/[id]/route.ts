import {
  NextRequest,
  NextResponse
} from 'next/server'
import {getServerSession} from 'next-auth'
import {revalidatePath} from 'next/cache'
import MessageDocument from '@/interfaces/MessageDocument'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import success204response from '@/httpResponses/success204response'
import error401response from '@/httpResponses/error401response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import authOpts from '@/config/authOpts'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
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
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(session.user.id)
      if (user) {
        const message: MessageDocument | null = await messageModel.findById((await params).id)
        if (message) {
          if (user.id === message.recipient.toString()) {
            await messageModel.findByIdAndDelete(message.id)
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
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(session.user.id)
      if (user) {
        const message: MessageDocument | null = await messageModel.findById((await params).id)
        if (message) {
          if (user.id === message.recipient.toString()) {
            message.read = !message.read
            await message.save()
            revalidatePath(
              '/messages',
              'page'
            )
            return success200response(message)
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