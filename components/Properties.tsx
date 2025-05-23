import {
  FunctionComponent,
  ReactElement
} from 'react'
import PropertyCard from '@/components/PropertyCard'
import Paginator from '@/components/Paginator'
import PropertiesComponentProps from '@/types/PropertiesComponentProps'
import PlainProperty from '@/types/PlainProperty'
const Properties: FunctionComponent<PropertiesComponentProps> = ({
  properties,
  page = 1,
  size = 6,
  total
}): ReactElement => (
  <section className='px-4 py-6'>
    <div className='container-xl lg:container m-auto px-4 py-6'>
      {properties.length === 0 ? (
        <p>
          No properties currently available.
        </p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {properties.map((property: PlainProperty): ReactElement => (
            <PropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      )}
      <Paginator
        page={page}
        size={size}
        total={total}
        fromSearch={false}
      />
    </div>
  </section>
)
export default Properties