import PlainDocument from '@/interfaces/PlainDocument'
export default interface PlainUser extends PlainDocument {
  email: string
  username: string
  image?: string
  bookmarks: string[]
}