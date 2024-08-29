import PlainDocument from '@/interfaces/PlainDocument'
import PlainProperty from '@/interfaces/PlainProperty'
import PlainUser from '@/interfaces/PlainUser'
interface PlainMessage extends PlainDocument {
  sender: PlainUser
  recipient: PlainUser
  property: PlainProperty
  name: string
  email: string
  phone?: string
  body?: string
  read: boolean
}
export default PlainMessage