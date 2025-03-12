import {
  Model,
  Schema,
  model,
  models
} from 'mongoose'
import PropertyDocument from '@/interfaces/PropertyDocument'
const propertyModel: Model<PropertyDocument> = models.Property ?? model<PropertyDocument>(
  'Property',
  new Schema<PropertyDocument>({
    owner : {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [
        true,
        'Please provide the owner.'
      ]
    },
    name: {
      type: Schema.Types.String,
      required: [
        true,
        'Please provide a property name.'
      ]
    },
    type: {
      type: Schema.Types.String,
      required: [
        true,
        'Please provide the property type.'
      ]
    },
    description: {
      type: Schema.Types.String,
      required: [
        true,
        'Please provide a description.'
      ]
    },
    location: {
      street: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the street.'
        ]
      },
      city: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the city.'
        ]
      },
      state: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the state.'
        ]
      },
      zipcode: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the zip code.'
        ]
      }
    },
    beds: {
      type: Schema.Types.Number,
      required: [
        true,
        'Please provide the number of beds.'
      ]
    },
    baths: {
      type: Schema.Types.Number,
      required: [
        true,
        'Please provide the number of baths.'
      ]
    },
    square_feet: {
      type: Schema.Types.Number,
      required: [
        true,
        'Please provide the size in square feet.'
      ]
    },
    amenities: [{
      type: Schema.Types.String,
      required: [
        true,
        'Please list the available amenities.'
      ]
    }],
    rates: {
      nightly: {
        type: Schema.Types.Number
      },
      weekly: {
        type: Schema.Types.Number
      },
      monthly: {
        type: Schema.Types.Number
      }
    },
    seller_info: {
      name: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the owner\'s name.'
        ]
      },
      email: {
        type: Schema.Types.String,
        required: [
          true,
          'Please provide the owner\'s email address.'
        ]
      },
      phone: {
        type: Schema.Types.String
      }
    },
    images: [{
      type: Schema.Types.String,
      required: [
        true,
        'Please upload some photos of the property.'
      ]
    }],
    imageIds: [{
      type: Schema.Types.String,
      required: [
        true,
        'Please upload some photos of the property.'
      ]
    }],
    is_featured: {
      type: Schema.Types.Boolean,
      default: false,
      required: true
    }
  }, {
    timestamps: true
  })
)
export default propertyModel