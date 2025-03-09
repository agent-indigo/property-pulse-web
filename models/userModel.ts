import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
const userModel: Model<UserDocument> = models.User ?? model<UserDocument>(
  'User',
  new Schema<UserDocument>({
    email: {
      type: Schema.Types.String,
      unique: true,
      required: [
        true,
        'Please provide your email address.'
      ]
    },
    username: {
      type: Schema.Types.String,
      required: [
        true,
        'Please provide a user name.'
      ]
    },
    image: {
      type: Schema.Types.String
    },
    bookmarks: [{
      type: Schema.Types.ObjectId,
      ref: 'Property'
    }],
    role: {
      type: Schema.Types.String,
      required: true,
      enum: [
        'admin',
        'dev',
        'root',
        'user'
      ],
      default: 'user'
    }
  }, {
    timestamps: true
  })
)
export default userModel