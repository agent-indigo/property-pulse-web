import {NextRequest, NextResponse} from 'next/server'
import {Document, Types, Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/utilities/getSessionUser'
import {e401, e500, s200} from '@/utilities/responses'
import {InquiryMessage, RegisteredUser} from '@/utilities/interfaces'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    Get messages
 * @route   GET /api/messages
 * @access  private
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    await connectToMongoDB()
    return user ? s200(JSON.stringify(await messageModel.find({recipient: user._id}).populate(
      'sender',
      'username'
    ).populate(
      'property',
      'name'
    ).sort({
      read: 1,
      createdAt: -1
    }))) : e401
  } catch (error: any) {
    return e500(
      'retrieving messages',
      error
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
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      const sender: Types.ObjectId = user._id
      const form: FormData = await request.formData()
      const recipient: Types.ObjectId = new Types.ObjectId(form.get('recipient')?.valueOf().toString())
      if (sender !== recipient) {
        const message: Document<unknown, {}, InquiryMessage> & InquiryMessage & {_id: Schema.Types.ObjectId} = new messageModel({
          sender,
          recipient,
          property: form.get('property')?.valueOf(),
          name: form.get('name')?.valueOf(),
          email: form.get('email')?.valueOf(),
          phone: form.get('phone')?.valueOf(),
          body: form.get('body')?.valueOf(),
          read: false
        })
        await connectToMongoDB()
        await message.save()
        return s200(JSON.stringify({message: 'Message sent'}))
      } else {
        return new NextResponse(
          'You can\'t send a message to yourself.',
          {status: 400}
        )
      }
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'sending message',
      error
    )
  }
}