import {
  Document,
  ObjectId
} from 'mongoose'
interface MessageDocument extends Document {
  sender: ObjectId
  recipient: ObjectId
  property: ObjectId
  name: string
  email: string
  phone?: string
  body?: string
  read: boolean
}
export default MessageDocument