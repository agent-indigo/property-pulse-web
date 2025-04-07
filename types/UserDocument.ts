import {
  Document,
  ObjectId
} from 'mongoose'
export default interface UserDocument extends Document {
  email: string
  username: string
  image?: string
  bookmarks: ObjectId[]
  role: 'admin' | 'dev' | 'root' | 'user'
}