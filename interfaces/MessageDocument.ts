import {
  Document,
  ObjectId
} from 'mongoose'
export default interface MessageDocument extends Document {
  sender: ObjectId
  recipient: ObjectId
  property: ObjectId
  name: string
  email: string
  phone?: string
  body?: string
  read: boolean
}