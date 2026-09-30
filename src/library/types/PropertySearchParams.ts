import Pagination from '@/src/library/types/Pagination'
export default interface PropertySearchParams extends Pagination {
  location?: string
  type: string
}