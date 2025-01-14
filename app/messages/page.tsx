import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {FlattenMaps} from 'mongoose'
import MessageCard from '@/components/MessageCard'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/serverActions/getSessionUser'
import PlainMessage from '@/interfaces/PlainMessage'
import MessageDocument from '@/interfaces/MessageDocument'
export const metadata: Metadata = {
  title: 'Messages'
}
const MessagesPage: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const messages: PlainMessage[] = (await messageModel.find({
    recipient: (await getSessionUser()).sessionUser?._id
  }).populate(
    'sender',
    'username'
  ).populate(
    'property',
    'id name'
  ).sort({
    read: 1,
    createdAt: -1
  }).lean()).map((message: FlattenMaps<MessageDocument>): PlainMessage => {
    const plainMessage: PlainMessage = JSON.parse(JSON.stringify(message))
    plainMessage.sender = JSON.parse(JSON.stringify(plainMessage.sender))
    plainMessage.property = JSON.parse(JSON.stringify(plainMessage.property))
    return plainMessage
  })
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24 max-w-6xl'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Messages
          </h1>
          <div className='space-y-4'>
            {messages.length === 0 ? (
              <p>
                You have no messages.
              </p>
            ) : (messages.map((message: PlainMessage): ReactElement => (
              <MessageCard
                key={message._id}
                message={message}
              />
            )))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default MessagesPage