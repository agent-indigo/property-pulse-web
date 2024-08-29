import SessionWithUserId from '@/interfaces/SessionWithUserId'
interface NewSession {
  newSession: SessionWithUserId
  trigger: 'update'
}
export default NewSession