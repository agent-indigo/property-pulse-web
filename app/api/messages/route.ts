import {NextRequest, NextResponse} from 'next/server'
import {Document, Types, ObjectId} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/utilities/getSessionUser'
import {e400, e401, e500, s200, s204} from '@/utilities/responses'
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
    const user: RegisteredUser | undefined = await getSessionUser()
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
  const activity: string = 'sending message'
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const sender: Types.ObjectId = user._id
      const message: InquiryMessage = await request.json()
      if (sender.toString() !== message.recipient.toString()) {
        const document: Document<unknown, {}, InquiryMessage> & InquiryMessage & {_id: ObjectId} = new messageModel({
          sender,
          ...message,
          read: false
        })
        await connectToMongoDB()
        await document.save()
        return s204(JSON.stringify({message: 'Message sent.'}))
      } else {
        return e401
      }
    } else {
      return e400('send yourself a message')
    }
  } catch (error: any) {
    return e500(
      activity,
      error
    )
  }
}