import PlainDocument from '@/src/library/types/PlainDocument'
import PlainUser from '@/src/library/types/PlainUser'
import PlainProperty from '@/src/library/types/PlainProperty'
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