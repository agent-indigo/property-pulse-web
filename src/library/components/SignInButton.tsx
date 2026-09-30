'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {
  signIn,
  SignInResponse
} from 'next-auth/react'
import {FaGoogle} from 'react-icons/fa'
const SignInButton: FunctionComponent = (): ReactElement =>  (
  <button
    onClick={async (): Promise<SignInResponse | undefined> => await signIn('google')}
    className='flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
  >
    <FaGoogle className='text-white mr-2'/>
    <span>
      Log In or Register
    </span>
  </button>
)
export default SignInButton