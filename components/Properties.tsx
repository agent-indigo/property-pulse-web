import {FunctionComponent, ReactElement} from 'react'
import PropertyCard from '@/components/PropertyCard'
import Paginator from '@/components/Paginator'
import PropertiesCompomentProps from '@/interfaces/PropertiesComponentProps'
import PlainProperty from '@/interfaces/PlainProperty'
const Properties: FunctionComponent<PropertiesCompomentProps> = ({
  properties,
  page,
  size,
  total
}): ReactElement => (
  <section className='px-4 py-6'>
    <div className='container-xl lg:container m-auto px-4 py-6'>
      {properties.length === 0 ? (
        <p>No current properties.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {properties.map((
            property: PlainProperty
          ): ReactElement => (
            <PropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      )}
      <Paginator
        page={page ?? 1}
        size={size ?? 6}
        total={total}
        fromSearch={false}
      />
    </div>
  </section>
)
export default Properties