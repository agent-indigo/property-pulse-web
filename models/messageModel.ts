import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import MessageDocument from '@/interfaces/MessageDocument'
const MessageSchema: Schema<MessageDocument> = new Schema<MessageDocument>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  name: {
    type: String,
    required: [
      true,
      'Please provide your name.'
    ]
  },
  email: {
    type: String,
    required: [
      true,
      'Please provide your email address.'
    ]
  },
  phone: {
    type: String
  },
  body: {
    type: String
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})
const messageModel: Model<MessageDocument> = models.Message ?? model<MessageDocument>(
  'Message', 
  MessageSchema
)
export default messageModel