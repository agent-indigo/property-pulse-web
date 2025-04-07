import PlainDocument from '@/types/PlainDocument'
export default interface PlainUser extends PlainDocument {
  email: string
  username: string
  image?: string
  bookmarks: string[]
  role: 'admin' | 'dev' | 'root' | 'user'
}