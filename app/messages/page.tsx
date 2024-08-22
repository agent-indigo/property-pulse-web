import Messages from '@/components/Messages'
import {Metadata} from 'next'
import {FunctionComponent, ReactElement} from 'react'
export const metadata: Metadata = {
  title: 'Messages'
}
const MessagesPage: FunctionComponent = (): ReactElement => (
  <Messages/>
)
export default MessagesPage