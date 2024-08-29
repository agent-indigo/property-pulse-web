import {FunctionComponent, ReactElement} from 'react'
import Link from 'next/link'
import PaginatorProps from '@/interfaces/PaginatorProps'
const Paginator: FunctionComponent<PaginatorProps> = ({
  page = 1,
  total,
  size = 6,
  fromSearch = false
}): ReactElement => {
  const pages: number = Math.ceil(total / size)
  return (
    <section className='container mx-auto flex justify-center items-center my-8'>
      {page > 1 && (
        <Link
          href={`/properties${fromSearch && '/search'}?page=${page - 1}`}
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
          href={`/properties${fromSearch && '/search'}?page=${page + 1}`}
          className='ml-2 px-2 py-1 border border-gray-300 rounded'
        >
          Next
        </Link>
      )}
    </section>
  )
}
export default Paginator