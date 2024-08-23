import {FunctionComponent, ReactElement} from 'react'
import {Pagination} from '@/utilities/interfaces'
const Paginator: FunctionComponent<Pagination> = ({
  page,
  total,
  paginate
}): ReactElement => {
  const pages: number = Math.ceil(total / 6)
  const handleClick: Function = (to: number): void => to > 0 && to <= pages && paginate(to)
  return (
    <section className='container mx-auto flex justify-center items-center my-8'>
      <button
        onClick={():void => handleClick(page - 1)}
        disabled={page === 1}
        className='mr-2 px-2 py-1 border border-gray-300 rounded'
      >
        Previous
      </button>
      <span className='mx-2'>
        Page {page} of {pages}
      </span>
      <button
        onClick={():void => handleClick(page + 1)}
        disabled={page === pages}
        className='ml-2 px-2 py-1 border border-gray-300 rounded'
      >
        Next
      </button>
    </section>
  )
}
export default Paginator