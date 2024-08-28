import {FlattenMaps} from 'mongoose'
import MessageDocument from '@/interfaces/MessageDocument'
import UserDocument from '@/interfaces/UserDocument'
import PropertyDocument from '@/interfaces/PropertyDocument'
interface LeanMessage extends FlattenMaps<MessageDocument> {
  sender: FlattenMaps<UserDocument>
  recipient: FlattenMaps<UserDocument>
  property: FlattenMaps<PropertyDocument>
}
export default LeanMessage
// import {FlattenMaps} from 'mongoose'
// import MessageDocument from './MessageDocument'
// import UserDocument from './UserDocument'
// import PropertyDocument from './PropertyDocument'
// interface LeanMessage {
//   message: FlattenMaps<MessageDocument> & {
//     sender: FlattenMaps<UserDocument>
//     recipient: FlattenMaps<UserDocument>
//     property: FlattenMaps<PropertyDocument>
//   }
// }
// export default LeanMessage