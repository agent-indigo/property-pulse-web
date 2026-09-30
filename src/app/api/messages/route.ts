import {
  NextRequest,
  NextResponse
} from 'next/server'
import {
  getServerSession,
  Session
} from 'next-auth'
import {revalidatePath} from 'next/cache'
import connectToMongoDB from '@/src/library/utilities/connectToMongoDB'
import messageDocumentModel from '@/src/library/models/messageDocumentModel'
import success200response from '@/src/library/httpResponses/success200response'
import error401response from '@/src/library/httpResponses/error401response'
import error500response from '@/src/library/httpResponses/error500response'
import success201response from '@/src/library/httpResponses/success201response'
import error400response from '@/src/library/httpResponses/error400response'
import authOpts from '@/src/library/config/authOpts'
import UserDocument from '@/src/library/types/UserDocument'
import userDocumentModel from '@/src/library/models/userDocumentModel'
import MessageDocument from '@/src/library/types/MessageDocument'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    GET all messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      return user ? success200response(await messageDocumentModel.find({
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
    const session: Session | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: UserDocument | null = await userDocumentModel.findOne({
        email: session.user?.email
      })
      if (user) {
        const form: FormData = await request.formData()
        const {id: sender}: UserDocument = user
        const recipient: string | undefined = form.get('recipient')?.valueOf().toString()
        if (recipient && recipient !== sender) {
          const message: MessageDocument = await messageDocumentModel.create({
            sender,
            ...Object.fromEntries(form.entries()),
            read: false
          })
          revalidatePath(
            '/messages',
            'page'
          )
          return success201response(message.toObject())
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