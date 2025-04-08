'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {
  ClientSafeProvider,
  signIn,
  SignInResponse
} from 'next-auth/react'
import {FaGoogle} from 'react-icons/fa'
import SignInButtonProps from '@/types/SignInButtonProps'
const SignInButton: FunctionComponent<SignInButtonProps> = ({provider}): ReactElement => {
  const {id}: ClientSafeProvider = provider
  return (
  <button
    key={id}
    onClick={(): Promise<SignInResponse | undefined> => signIn(id)}
    className='flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
  >
    <FaGoogle className='text-white mr-2'/>
    <span>
      Log In or Register
    </span>
  </button>
)}
export default SignInButton