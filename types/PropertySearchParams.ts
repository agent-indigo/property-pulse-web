import Pagination from '@/types/Pagination'
export default interface PropertySearchParams extends Pagination {
  location?: string
  type: string
}