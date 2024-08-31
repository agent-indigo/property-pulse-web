import Pagination from '@/interfaces/Pagination'
interface PropertySearchParams extends Pagination {
  location?: string
  type: string
}
export default PropertySearchParams