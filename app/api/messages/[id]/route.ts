import {
  NextRequest,
  NextResponse
} from 'next/server'
import MessageDocument from '@/interfaces/MessageDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import messageModel from '@/models/messageModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
export const dynamic = 'force-dynamic'
/**
 * @name    DELETE
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  private
 */
export const DELETE = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById((await params).id)
      if (message) {
        if (sessionUser._id === message.recipient.toString()) {
          await messageModel.findByIdAndDelete(message._id)
          return new NextResponse(
            undefined, {
              status: 204,
              statusText: 'Message deleted'
            }
          )
        } else {
          return new NextResponse(
            undefined, {
              status: 401,
              statusText: 'Undefined'
            }
          )
        }
      } else {
        return new NextResponse(
          undefined, {
            status: 404,
            statusText: 'Message not found'
          }
        )
      }
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Undefined'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
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
  let status: string = 'read/unread'
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const message: MessageDocument | null = await messageModel.findById((await params).id)
      if (message) {
        if (sessionUser._id = message.recipient.toString()) {
          const read: boolean = message.read
          message.read = !read
          status = read ? 'unread' : 'read'
          await message.save()
          return new NextResponse(
            JSON.stringify(message), {
              status: 200,
              statusText: `Message marked as ${status}.`
            }
          )
        } else {
          return new NextResponse(
            undefined, {
              status: 401,
              statusText: 'Undefined'
            }
          )
        }
      } else {
        return new NextResponse(
          undefined, {
            status: 404,
            statusText: 'Message not found'
          }
        )
      }
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Undefined'
        }
      )
    }
  } catch (error: any) {
    return new NextResponse(
      undefined, {
        status: 500,
        statusText: `Internal server error:\n${error.toString()}`
      }
    )
  }
}