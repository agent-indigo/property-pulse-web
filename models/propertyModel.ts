import {Model, Schema, model, models} from 'mongoose'
import {ListedProperty} from '@/utilities/interfaces'
const propertySchema = new Schema<ListedProperty>({
  owner : {
    type: Schema.Types.ObjectId,
    ref: 'User' as string,
    required: [true as boolean, 'Please provide the owner.' as string]
  },
  name: {
    type: String as StringConstructor,
    required: [true as boolean, 'Please provide a property name.' as string]
  },
  type: {
    type: String as StringConstructor,
    required: [true as boolean, 'Please provide the property type.' as string]
  },
  description: {
    type: String as StringConstructor,
    required: [true as boolean, 'Please provide a description.' as string]
  },
  location: {
    street: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the street.' as string]
    },
    city: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the city.' as string]
    },
    state: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the state.' as string]
    },
    zipcode: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the zip code.' as string]
    }
  },
  beds: {
    type: Number as NumberConstructor,
    required: [true as boolean, 'Please provide the number of beds.' as string]
  },
  baths: {
    type: Number as NumberConstructor,
    required: [true as boolean, 'Please provide the number of baths.' as string]
  },
  square_feet: {
    type: Number as NumberConstructor,
    required: [true as boolean, 'Please provide the size in square feet.' as string]
  },
  amenities: [
    {
      type: String as StringConstructor,
      required: [true as boolean, 'Please list the available amenities.' as string]
    }
  ],
  rates: {
    nightly: {
      type: Number as NumberConstructor
    },
    weekly: {
      type: Number as NumberConstructor
    },
    monthly: {
      type: Number as NumberConstructor
    }
  },
  seller_info: {
    name: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the owner\'s name.' as string]
    },
    email: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the owner\'s email address.' as string]
    },
    phone: {
      type: String as StringConstructor,
      required: [true as boolean, 'Please provide the owner\'s phone number.' as string]
    }
  },
  images: [
    {
      type: String as StringConstructor,
      required: [true as boolean, 'Please upload some photos of the property.' as string]
    }
  ],
  is_featured: {
    type: Boolean as BooleanConstructor,
    default: false as boolean,
    required: true as boolean
  }
}, {
  timestamps: true as boolean
})
const propertyModel: Model<ListedProperty> = models.Property as Model<ListedProperty> || model<ListedProperty>('Property' as string, propertySchema as Schema<ListedProperty>) as Model<ListedProperty>
export default propertyModel as Model<ListedProperty>