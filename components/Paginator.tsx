import {
  FunctionComponent,
  ReactElement
} from 'react'
import Link from 'next/link'
import PaginatorProps from '@/interfaces/PaginatorProps'
const Paginator: FunctionComponent<PaginatorProps> = ({
  page = 1,
  size = 6,
  total = 0,
  fromSearch = false
}): ReactElement => {
  const current: number = parseInt(page.toString())
  const destination: string = fromSearch ? '/properties/search?page=' : '/properties?page='
  const pages: number = Math.ceil(total / size)
  return (
    <section className='container mx-auto flex justify-center items-center my-8'>
      {page > 1 && (
        <Link
          href={`${destination}${current - 1}`}
          className='mr-2 px-2 py-1 border border-gray-300 rounded'
        >
          Previous
        </Link>
      )}
      <span className='mx-2'>
        Page {page} of {pages}
      </span>
      {page < pages && (
        <Link
          href={`${destination}${current + 1}`}
          className='ml-2 px-2 py-1 border border-gray-300 rounded'
        >
          Next
        </Link>
      )}
    </section>
  )
}
export default Paginator