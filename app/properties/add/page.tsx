import type {Metadata} from 'next'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import AddPropertyForm from '@/components/AddPropertyForm'
export const metadata: Metadata = {
  title: 'Add Property'
}
const AddPropertyPage: FunctionComponent = (): ReactElement => (
  <section className='bg-blue-50'>
    <div className='container m-auto max-w-2xl py-24'>
      <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
        <AddPropertyForm/>
      </div>
    </div>
  </section>
)
export default AddPropertyPage