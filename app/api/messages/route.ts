import {
  NextRequest,
  NextResponse
} from 'next/server'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import PlainUser from '@/interfaces/PlainUser'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      return new NextResponse(
        JSON.stringify(await messageModel.find({
          recipient: sessionUser._id
        }).populate(
          'sender',
          'username'
        ).populate(
          'property',
          '_id name'
        ).sort({
          read: 1,
          createdAt: -1
        }).lean()), {
          status: 200,
          statusText: 'OK'
        }
      )
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Unauthorized'
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
 * @name    POST
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const {
      sessionUser,
      success
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      const form: FormData = await request.formData()
      const {_id: sender}: PlainUser = sessionUser
      const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
      if (recipient && recipient !== sender) {
        await connectToMongoDB()
        return new NextResponse(
          JSON.stringify(await messageModel.create({
            sender,
            recipient,
            property: form.get('property')?.valueOf(),
            name: form.get('name')?.valueOf(),
            email: form.get('email')?.valueOf(),
            phone: form.get('phone')?.valueOf(),
            body: form.get('body')?.valueOf(),
            read: false
          })), {
            status: 201,
            statusText: 'Message sent.'
          }
        )
      } else {
        return new NextResponse(
          undefined, {
            status: 400,
            statusText: 'You can\'t send yourself a message.'
          }
        )
      }
    } else {
      return new NextResponse(
        undefined, {
          status: 401,
          statusText: 'Unauthorized'
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