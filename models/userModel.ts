import {Model, Schema, model, models} from 'mongoose'
import {RegisteredUser} from '@/utilities/interfaces'
const userSchema = new Schema<RegisteredUser>({
  email: {
    type: String as StringConstructor,
    unique: true as boolean,
    required: [true as boolean, 'Please provide your email address.' as string]
  },
  username: {
    type: String as StringConstructor,
    required: [true as boolean, 'Please provide a user name.' as string]
  },
  image: {
    type: String as StringConstructor
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Property' as string
    }
  ]
}, {
  timestamps: true as boolean
})
const userModel: Model<RegisteredUser> = models.User as Model<RegisteredUser> || model<RegisteredUser>('User' as string, userSchema as Schema<RegisteredUser>) as Model<RegisteredUser>
export default userModel as Model<RegisteredUser>