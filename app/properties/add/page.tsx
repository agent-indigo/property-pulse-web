import type {Metadata} from 'next'
import {ReactElement} from 'react'
export const metadata: Metadata = {
  title: 'Add Property'
}
const AddPropertyPage: React.FC = (): ReactElement => {
  return <h1>Add property</h1>
}
export default AddPropertyPage