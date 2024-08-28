import {AdapterUser} from 'next-auth/adapters'
interface AdapterUserWithId extends AdapterUser {
  id: string
}
export default AdapterUserWithId