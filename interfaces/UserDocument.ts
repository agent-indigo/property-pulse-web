import {Document, ObjectId} from 'mongoose'
interface UserDocument extends Document {
  email: string
  username: string
  image?: string
  bookmarks: ObjectId[]
}
export default  UserDocument