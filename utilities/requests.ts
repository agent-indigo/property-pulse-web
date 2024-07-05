import {ListedProperty} from '@/utilities/interfaces'
const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? '' as string
/**
 * @name    getProperties
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (): Promise<ListedProperty[]> => {
  try {
    if (api as string === '' as string) {
      return [] as ListedProperty[]
    } else {
      const response: Response = await fetch(`${api as string}/properties` as string, {cache: 'no-store'}) as Response
      if (response.ok as boolean) {
        return response.json() as Promise<ListedProperty[]>
      } else {
        throw new Error('Error fetching properties.' as string) as Error
      }
    }
  } catch (error: unknown) {
    console.error(`Error fetching properties:\n${error as string}` as string)
    return [] as ListedProperty[]
  }
}
/**
 * @name    getProperty
 * @desc    GET a single property
 * @route   GET /api/properties/:_id
 * @access  public
 */
export const getProperty: Function = async (id: string): Promise<ListedProperty | null> => {
  try {
    if (api as string === '' as string) {
      return null
    } else {
      const response: Response = await fetch(`${api as string}/properties/${id as string}` as string) as Response
      if (response.ok as boolean) {
        return response.json() as Promise<ListedProperty>
      } else {
        throw new Error('Error fetching property.' as string) as Error
      }
    }
  } catch (error: unknown) {
    console.error(`Error fetching property:\n${error as string}` as string)
    return null
  }
}