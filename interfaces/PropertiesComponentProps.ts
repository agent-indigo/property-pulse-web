import PropertySearchParams from '@/interfaces/PropertySearchParams'
import PaginatorProps from './PaginatorProps'
import Properties from './Properties'
interface PropertiesComponentProps extends PropertySearchParams, PaginatorProps, Properties {}
export default PropertiesComponentProps