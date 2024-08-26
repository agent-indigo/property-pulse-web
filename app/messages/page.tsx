import {FunctionComponent, ReactElement} from 'react'
import {Metadata} from 'next'
import {FlattenMaps} from 'mongoose'
import MessageCard from '@/components/MessageCard'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import messageModel from '@/models/messageModel'
import serialize from '@/utilities/serialize'
import getSessionUser from '@/utilities/getSessionUser'
import {InquiryMessage, LeanDocumentId, SerializedMessage} from '@/utilities/interfaces'
export const metadata: Metadata = {
  title: 'Messages'
}
const MessagesPage: FunctionComponent = async (): Promise<ReactElement> => {
  const getMessages: Function = async (read: boolean): Promise<any[]> => {
    await connectToMongoDB()
    return await messageModel.find({
      recipient: (await getSessionUser())?._id,
      read
    }).sort({createdAt: -1}).populate(
      'sender',
      'username'
    ).populate(
      'property',
      'name'
    ).lean()
  }
  const messages: SerializedMessage[] = [
    ...await getMessages(false),
    ...await getMessages(true)
  ].map((message: FlattenMaps<InquiryMessage> & Required<LeanDocumentId>) => {
    const serializedMessage: SerializedMessage = serialize(message)
    serializedMessage.sender = serialize(serializedMessage.sender)
    serializedMessage.property = serialize(serializedMessage.property)
    return serializedMessage
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
            ) : (messages.map((message: SerializedMessage) => (
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