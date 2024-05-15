import {Schema, model, models} from 'mongoose'
import {User} from '@/utilities/interfaces'
const userSchema = new Schema<User>({
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide your email address.']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'Please provide a username.']
    },
    image: {
        type: String
    },
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Property'
        }
    ]
}, {
    timestamps: true
})
const userModel = models.userModel || model<User>('User', userSchema)
export default userModel