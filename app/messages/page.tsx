import {FunctionComponent, ReactElement} from 'react'
import {Metadata} from 'next'
import {toast} from 'react-toastify'
import {FlattenMaps} from 'mongoose'
import MessageCard from '@/components/MessageCard'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from '@/serverActions/getSessionUser'
import PlainMessage from '@/interfaces/PlainMessage'
import MessageDocument from '@/interfaces/MessageDocument'
import convertToPlainDocument from '@/utilities/convertToPlainDocument'
export const metadata: Metadata = {
  title: 'Messages'
}
const MessagesPage: FunctionComponent = async (): Promise<ReactElement> => {
  const {error, sessionUser, success}: ServerActionResponse = await getSessionUser()
  const getMessages: Function = async (read: boolean): Promise<PlainMessage[]> => {
    if (success && sessionUser) {
      await connectToMongoDB()
      return (
        await messageModel
        .find({
          recipient: sessionUser._id,
          read
        })
        .sort({createdAt: -1})
        .populate(
          'sender',
          'username'
        )
        .populate(
          'property',
          'name'
        )
        .lean())
        .map((message: FlattenMaps<MessageDocument>): PlainMessage => convertToPlainDocument(message)
      )
    } else {
      toast.error(error)
      return []
    }
  }
  const messages: PlainMessage[] = [
    ...await getMessages(false),
    ...await getMessages(true)
  ]
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