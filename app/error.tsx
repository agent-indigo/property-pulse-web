'use client'
import Link from 'next/link'
import {FaExclamationTriangle} from 'react-icons/fa'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import ErrorPageProps from '@/interfaces/ErrorPageProps'
const ErrorPage: FunctionComponent<ErrorPageProps> = ({
  error,
  reset
}): ReactElement => (
  <section className='bg-blue-50 min-h-screen flex-grow'>
    <div className='container m-auto max-w-2xl py-24'>
      <div className='bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0'>
        <div className='flex justify-center'>
          <FaExclamationTriangle className='fa-5x text-8xl text-red-400'/>
        </div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mt-4 mb02'>
            Error
          </h1>
          <h2 className='text-2xl font-bold my-2 text-red-400'>
            {error.message}
          </h2>
          <div className='pb-1'>
            <button
              onClick={(): void => reset()}
              className='bg-yellow-500 hover:bg-yellow-600 font-bold py-4 px-6 rounded'
            >
              Retry
            </button>
          </div>
          <div className='pt-1'>
            <Link
              href='/'
              className='bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded inline-block'
            >
              Home
            </Link>
          </div>
        </div>
      </div>
      <div className='flex-grow'/>
    </div>
  </section>
)
export default ErrorPage