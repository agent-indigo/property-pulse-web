'use client'
import {useEffect, ReactElement, FunctionComponent} from 'react'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import {Helmet} from 'react-helmet'
import {useGetMessagesQuery} from '@/slices/messagesApiSlice'
import Spinner from '@/components/Spinner'
import {InquiryMessage} from '@/utilities/interfaces'
import Message from '@/components/Message'
const Messages: FunctionComponent = (): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const {data: messages, isLoading, isError, error} = useGetMessagesQuery()
  useEffect(
    (): void => {
      if (!isLoading) {
        if (isError) {
          toast.error(`Error retrieving messages:\n${JSON.stringify(error)}`)
          router.push('/error')
        }
      }
    },
    [isError, error, router, isLoading]
  )
  return isLoading ? (
    <>
      <Helmet>
        <title>
          Loading... | PropertyPulse | Find the Perfect Rental
        </title>
      </Helmet>
      <Spinner loading={isLoading}/>
    </>
  ) : (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24 max-w-6xl'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Messages
          </h1>
          <div className='space-y-4'>
            {messages && (messages.length > 0 ? messages.map((message: InquiryMessage): ReactElement => (
              <Message
                key={message._id?.toString()}
                message={message}
              />
            )) : (
              <p>
                You currently have no messages.
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default Messages