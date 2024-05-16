import {Schema, model, models} from 'mongoose'
import {IProperty} from '@/utilities/interfaces'
const propertySchema = new Schema<IProperty>({
    owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        }
    },
    beds: {
        type: Number,
        required: true
    },
    baths: {
        type: Number,
        required: true
    },
    square_feet: {
        type: Number,
        required: true
    },
    amenities: [
        {
            type: String,
            required: true
        }
    ],
    rates: {
        nightly: {
            type: Number
        },
        weekly: {
            type: Number
        },
        monthly: {
            type: Number
        }
    },
    seller_info: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    is_featured: {
        type: Boolean,
        default: false,
        required: true
    }
}, {
    timestamps: true
})
const propertyModel = models.Property || model<IProperty>('Property', propertySchema)
export default propertyModel