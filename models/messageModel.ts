import {Model, Schema, model, models} from 'mongoose'
import {InquiryMessage} from '@/utilities/interfaces'
const MessageSchema = new Schema<InquiryMessage>({
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
    required: [true, 'Please provide your name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.']
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
const messageModel: Model<InquiryMessage> = models.Message || model<InquiryMessage>(
  'Message', 
  MessageSchema
)
export default messageModel