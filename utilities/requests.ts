import {ListedProperty} from '@/utilities/interfaces'
const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
/**
 * @name    getProperties
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (): Promise<ListedProperty[]> => {
  try {
    if (api === '') {
      return []
    } else {
      const response: Response = await fetch(`${api}/properties`)
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Error fetching properties.')
      }
    }
  } catch (error: any) {
    console.error(`Error fetching properties:\n${error.toString()}`)
    return []
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
    if (api === '') {
      return null
    } else {
      const response: Response = await fetch(`${api}/properties/${id}`)
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Error fetching property.')
      }
    }
  } catch (error: any) {
    console.error(`Error fetching property:\n${error.toString()}`)
    return null
  }
}