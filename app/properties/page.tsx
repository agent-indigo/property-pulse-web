import type {Metadata} from 'next'
import {FunctionComponent, ReactElement} from 'react'
import SearchPropertiesForm from '@/components/SearchPropertiesForm'
import Properties from '@/components/Properties'
export const metadata: Metadata = {
  title: 'Properties'
}
const PropertiesPage: FunctionComponent = (): ReactElement => (
  <>
    <section className='bg-blue-700 py-4'>
      <div className='max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8'>
        <SearchPropertiesForm/>
      </div>
    </section>
    <Properties/>
  </>
)
export default PropertiesPage