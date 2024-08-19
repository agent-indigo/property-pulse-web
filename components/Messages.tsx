'use client'
import {useEffect, useState, ReactElement, FunctionComponent} from 'react'
import Spinner from '@/components/Spinner'
import {InquiryMessage} from '@/utilities/interfaces'
import {getMessages} from '@/utilities/requests'
import Message from '@/components/Message'
const Messages: FunctionComponent = (): ReactElement => {
  const [messages, setMessages] = useState<InquiryMessage[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const populate: Function = async (): Promise<void> => {
        setMessages(await getMessages())
        setLoading(false)
      }
      populate()
    },
    []
  )
  return loading ? <Spinner loading={loading}/> : (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24 max-w-6xl'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Messages
          </h1>
          <div className='space-y-4'>
            {messages.length > 0 ? messages.map((message: InquiryMessage) => (
              <Message
                key={message._id?.toString()}
                message={message}
              />
            )) : (
              <p>
                You currently have no messages.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
export default Messages