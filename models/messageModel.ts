import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import MessageDocument from '@/types/MessageDocument'
const messageModel: Model<MessageDocument> = models.Message ?? model<MessageDocument>(
  'Message', 
  new Schema<MessageDocument>({
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
      type: Schema.Types.String,
      required: [
        true,
        'Please provide your name.'
      ]
    },
    email: {
      type: Schema.Types.String,
      required: [
        true,
        'Please provide your email address.'
      ]
    },
    phone: {
      type: Schema.Types.String
    },
    body: {
      type: Schema.Types.String
    },
    read: {
      type: Schema.Types.Boolean,
      required: true,
      default: false
    }
  }, {
    timestamps: true
  })
)
export default messageModel