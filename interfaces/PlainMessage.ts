import PlainDocument from '@/interfaces/PlainDocument'
import PlainUser from '@/interfaces/PlainUser'
import PlainProperty from '@/interfaces/PlainProperty'
export default interface PlainMessage extends PlainDocument {
  sender: PlainUser
  recipient: string
  property: PlainProperty
  name: string
  email: string
  phone?: string
  body?: string
  read: boolean
}