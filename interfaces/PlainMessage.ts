import PlainDocument from '@/interfaces/PlainDocument'
interface PlainMessage extends PlainDocument {
  sender: {
    username: string
  }
  recipient: string
  property: {
    id: string
    name: string
  }
  name: string
  email: string
  phone?: string
  body?: string
  read: boolean
}
export default PlainMessage