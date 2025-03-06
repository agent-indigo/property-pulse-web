import {
  NextRequest,
  NextResponse
} from 'next/server'
import {getServerSession} from 'next-auth'
import {FlattenMaps} from 'mongoose'
import authOpts from '@/config/authOpts'
import error401response from '@/httpResponses/error401response'
import error500response from '@/httpResponses/error500response'
import success200response from '@/httpResponses/success200response'
import SessionWithUserId from '@/interfaces/SessionWithUserId'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import UserDocument from '@/interfaces/UserDocument'
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session: SessionWithUserId | null = await getServerSession(authOpts)
    if (session) {
      await connectToMongoDB()
      const user: FlattenMaps<UserDocument> | null = await userModel.findById(session.user.id).lean()
      return user ? success200response(user) : error401response
    } else {
      return error401response
    }
  } catch (error: any) {
    return error500response(error)
  }
}