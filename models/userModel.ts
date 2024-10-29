import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
const UserSchema = new Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: [
      true,
      'Please provide your email address.'
    ]
  },
  username: {
    type: String,
    required: [
      true,
      'Please provide a user name.'
    ]
  },
  image: {
    type: String
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }]
}, {
  timestamps: true
})
const userModel: Model<UserDocument> = models.User ?? model<UserDocument>(
  'User',
  UserSchema
)
export default userModel