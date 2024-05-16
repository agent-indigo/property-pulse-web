import {Schema, model, models} from 'mongoose'
import {IUser} from '@/utilities/interfaces'
const userSchema = new Schema<IUser>({
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
const userModel = models.User || model<IUser>('User', userSchema)
export default userModel