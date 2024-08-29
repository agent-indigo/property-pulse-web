import {Document, ObjectId} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
interface MessageDocument extends Document {
  sender?: ObjectId | UserDocument
  recipient: ObjectId | UserDocument
  property: ObjectId | PropertyDocument
  name: string
  email: string
  phone?: string
  body?: string
  read?: boolean
}
export default MessageDocument