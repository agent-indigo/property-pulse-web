import {FlattenMaps} from 'mongoose'
import PropertyDocument from './PropertyDocument'
interface LeanProperty {
  property: FlattenMaps<PropertyDocument> | null
}
export default LeanProperty