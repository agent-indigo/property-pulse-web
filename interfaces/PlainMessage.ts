import PlainDocument from '@/interfaces/PlainDocument'
export default interface PlainMessage extends PlainDocument {
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