import Pagination from '@/interfaces/Pagination'
export default interface PropertySearchParams extends Pagination {
  location?: string
  type: string
}