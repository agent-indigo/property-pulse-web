import {getServerSession} from 'next-auth'
import authOptions from '@/utilities/authOptions'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {AdapterUserWithId, RegisteredUser} from '@/utilities/interfaces'
const getSessionUser: Function = async (): Promise<RegisteredUser | null> => {
  await connectToMongoDB()
  return userModel.findById(((await getServerSession(authOptions))?.user as AdapterUserWithId).id)
}
export default getSessionUser