import {
  FunctionComponent,
  ReactElement
} from 'react'
import {Metadata} from 'next'
import {getServerSession} from 'next-auth'
import MessageCard from '@/components/MessageCard'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import PlainMessage from '@/types/PlainMessage'
import userModel from '@/models/userModel'
export const metadata: Metadata = {
  title: 'Messages'
}
const MessagesPage: FunctionComponent = async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const messages: PlainMessage[] = JSON.parse(JSON.stringify(await messageModel.find({
    recipient: (await userModel.findOne({
      email: (await getServerSession())?.user?.email
    }))?.id
  }).populate(
    'sender',
    'username'
  ).populate(
    'property',
    '_id name'
  ).sort({
    read: 1,
    createdAt: -1
  }).lean()))
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