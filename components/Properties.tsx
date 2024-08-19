'use client'
import {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from 'react'
import {ListedProperty} from '@/utilities/interfaces'
import PropertyCard from '@/components/PropertyCard'
import {getProperties} from '@/utilities/requests'
import Spinner from '@/components/Spinner'
import Paginator from '@/components/Paginator'
const Properties: FunctionComponent = (): ReactElement => {
  const [properties, setProperties] = useState<ListedProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const paginate: Function = (to: number) => setPage(to)
  useEffect(
    (): void => {
      const populate: Function = async (): Promise<void> => {
        const {properties, total} = getProperties(page)
        setProperties(properties)
        setTotal(total)
      }
      populate()
      setLoading(false)
    },
    [page]
  )
  return loading ? <Spinner loading={loading}/> : (
    <section className='px-4 py-6'>
      <div className='container-xl lg:container m-auto px-4 py-6'>
        {properties.length === 0 ? (
          <p>
            No properties currently available.
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {properties.map((property: ListedProperty) => (
              <PropertyCard
                key={property._id?.toString()}
                property={property}
              />
            ))}
          </div>
        )}
        <Paginator
          page={page}
          total={total}
          paginate={paginate}
        />
      </div>
    </section>
  )
}

export default Properties
