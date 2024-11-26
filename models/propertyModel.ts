import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import PropertyDocument from '@/interfaces/PropertyDocument'
const PropertySchema: Schema<PropertyDocument> = new Schema<PropertyDocument>({
  owner : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [
      true,
      'Please provide the owner.'
    ]
  },
  name: {
    type: String,
    required: [
      true,
      'Please provide a property name.'
    ]
  },
  type: {
    type: String,
    required: [
      true,
      'Please provide the property type.'
    ]
  },
  description: {
    type: String,
    required: [
      true,
      'Please provide a description.'
    ]
  },
  location: {
    street: {
      type: String,
      required: [
        true,
        'Please provide the street.'
      ]
    },
    city: {
      type: String,
      required: [
        true,
        'Please provide the city.'
      ]
    },
    state: {
      type: String,
      required: [
        true,
        'Please provide the state.'
      ]
    },
    zipcode: {
      type: String,
      required: [
        true,
        'Please provide the zip code.'
      ]
    }
  },
  beds: {
    type: Number,
    required: [
      true,
      'Please provide the number of beds.'
    ]
  },
  baths: {
    type: Number,
    required: [
      true,
      'Please provide the number of baths.'
    ]
  },
  square_feet: {
    type: Number,
    required: [
      true,
      'Please provide the size in square feet.'
    ]
  },
  amenities: [{
    type: String,
    required: [
      true,
      'Please list the available amenities.'
    ]
  }],
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
      required: [
        true,
        'Please provide the owner\'s name.'
      ]
    },
    email: {
      type: String,
      required: [
        true,
        'Please provide the owner\'s email address.'
      ]
    },
    phone: {
      type: String,
      required: [
        true,
        'Please provide the owner\'s phone number.'
      ]
    }
  },
  images: [{
    type: String,
    required: [
      true,
      'Please upload some photos of the property.'
    ]
  }],
  imageIds: [{
    type: String,
    required: [
      true,
      'Please upload some photos of the property.'
    ]
  }],
  is_featured: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true
})
const propertyModel: Model<PropertyDocument> = models.Property ?? model<PropertyDocument>(
  'Property',
  PropertySchema
)
export default propertyModel