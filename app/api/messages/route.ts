import {
  NextRequest,
  NextResponse
} from 'next/server'
import {getServerSession} from 'next-auth'
import {revalidatePath} from 'next/cache'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import success200response from '@/httpResponses/success200response'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import success201response from '@/httpResponses/success201response'
import error400response from '@/httpResponses/error400response'
import authOpts from '@/config/authOpts'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
import MessageDocument from '@/interfaces/MessageDocument'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET all messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(session.user.id)
      return user ? success200response(await messageModel.find({
        recipient: user.id
      }).populate(
        'sender',
        'username'
      ).populate(
        'property',
        '_id name'
      ).sort({
        read: 1,
        createdAt: -1
      }).lean()) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
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
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userModel.findById(session.user.id)
      if (user) {
        const form: FormData = await request.formData()
        const {id: sender}: UserDocument = user
        const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
        if (recipient && recipient !== sender) {
          const message: MessageDocument = await messageModel.create({
            sender,
            ...Object.fromEntries(form.entries()),
            read: false
          })
          revalidatePath(
            '/messages',
            'page'
          )
          return success201response(message)
        } else {
          return error400response('send yourself a message')
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