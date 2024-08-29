import PlainDocument from '@/interfaces/PlainDocument'
interface PlainUser extends PlainDocument {
  email: string
  username: string
  image?: string
  bookmarks: string[]
}
export default PlainUser