import {FlattenMaps} from 'mongoose'
import PropertyDocument from '@/interfaces/PropertyDocument'
interface LeanProperties {
  properties: FlattenMaps<PropertyDocument>[]
}
export default LeanProperties