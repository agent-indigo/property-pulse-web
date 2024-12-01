import {AdapterUser} from 'next-auth/adapters'
export default interface AdapterUserWithId extends AdapterUser {
  id: string
}