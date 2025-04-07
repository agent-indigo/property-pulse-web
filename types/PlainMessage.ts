import PlainDocument from '@/types/PlainDocument'
import PlainUser from '@/types/PlainUser'
import PlainProperty from '@/types/PlainProperty'
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