import {FlattenMaps} from 'mongoose'
import UserDocument from '@/interfaces/UserDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
interface LeanDocument {
  _id: any
  sender?: FlattenMaps<UserDocument>
  recipient?: FlattenMaps<UserDocument>
  property?: FlattenMaps<PropertyDocument>
  [key: string]: any
  createdAt: any
  updatedAt: any
}
export default LeanDocument