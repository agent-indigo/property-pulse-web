import {toast} from 'react-toastify'
import {ListedProperty} from '@/utilities/interfaces'
const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
/**
 * @name    getProperties
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (): Promise<ListedProperty[]> => {
  try {
    if (api === '') {
      toast.error('Error fetching properties.')
      return []
    } else {
      const response: Response = await fetch(`${api}/properties`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error('Error fetching properties.')
        return []
      }
    }
  } catch (error: any) {
    toast.error(`Error fetching properties:\n${error.toString()}`)
    return []
  }
}
/**
 * @name    getProperty
 * @desc    Get a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const getProperty: Function = async (id: string): Promise<ListedProperty | undefined> => {
  try {
    if (api === '') {
      toast.error('Error fetching property.')
      return
    } else {
      const response: Response = await fetch(`${api}/properties/${id}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error('Error fetching property.')
        return
      }
    }
  } catch (error: any) {
    toast.error(`Error fetching property:\n${error.toString()}`)
    return
  }
}
/**
 * @name    getUserProperties
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const getUserProperties: Function = async (id: string): Promise<ListedProperty[]> => {
  try {
    if (api === '') {
      toast.error('Error fetching user\'s properties.')
      return []
    } else {
      const response: Response = await fetch(`${api}/properties/user/${id}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error('Error fetching user\'s properties.')
        return []
      }
    }
  } catch (error: any) {
    toast.error(`Error fetching user\'s properties:\n${error.toString()}`)
    return []
  }
}
/**
 * @name    deleteProperty
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  private
 */
export const deleteProperty: Function = async (id: string): Promise<ListedProperty[]> => {
  try {
    if (api === '') {
      toast.error('Error deleting property.')
      return []
    } else {
      if (window.confirm('Are you sure you want to delete this property?')) {
        const response: Response = await fetch(
          `${api}/properties/${id}`,
          {method: 'DELETE'}
        )
        if (response.ok) {
          toast.success('Property deleted.')
          return getProperties().filter((property: ListedProperty) => property._id?.toString() !== id)
        } else {
          toast.error('Error deleting property.')
          return getProperties()
        }
      } else {
        return getProperties()
      }
    }
  } catch (error: any) {
    toast.error(`Error deleting property:\n${error.toString()}`)
    return getProperties()
  }
}
/**
 * @name    editProperty
 * @desc    Edit a property
 * @route   PUT /api/properties/:id
 * @access  private
 */
export const editProperty: Function = async (
  id: string,
  update: FormData
): Promise<void> => {
  try {
    if (api === '') {
      toast.error('Error updating property.')
    } else {
      const response: Response = await fetch(
        `${api}/properties/${id}`, {
          method: 'PUT',
          body: update
        }
      )
      if (response.ok) {
        toast.success('Property updated.')
      } else {
        toast.error('Unauthorized.')
      }
    }
  } catch (error: any) {
    toast.error(`Error updating property:\n${error.toString()}`)
  }
}