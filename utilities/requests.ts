import {toast} from 'react-toastify'
import {ListedProperty} from '@/utilities/interfaces'
const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
const noApiMsg: string = 'NEXT_PUBLIC_API_DOMAIN MISSING from `.env`.'
let action: string = ''
const eMsg: string = `Error ${action}.`
const eMsgPlus: Function = (error: any) => `Error ${action}:\n${error.toString()}`
/**
 * @name    getProperties
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (): Promise<ListedProperty[]> => {
  action = 'fetching properties'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const response: Response = await fetch(`${api}/properties`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return []
      }
    }
  } catch (error: any) {
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
  action = 'fetching property'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(`${api}/properties/${id}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
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
  action = 'fetching user\'s properties'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const response: Response = await fetch(`${api}/properties/user/${id}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return []
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
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
  action = 'deleting property'
  try {
    if (api === '') {
      toast.error(noApiMsg)
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
          toast.error(eMsg)
          return getProperties()
        }
      } else {
        return getProperties()
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
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
  action = 'saving changes'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(
        `${api}/properties/${id}`, {
          method: 'PUT',
          body: update
        }
      )
      response.ok ? toast.success('Property updated.') : toast.error('Unauthorized.')
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
  }
}
/**
 * @name    toggleBookmark
 * @desc    Add or remove a bookmark
 * @route   POST /api/properties/bookmarks
 * @access  private
 */
export const toggleBookmark: Function = async ({id}: {id: string}): Promise<boolean | undefined> => {
  action = 'adding/removing bookmark'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(
        `${api}/properties/bookmarks`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        }
      )
      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        return data.bookmarked
      } else {
        toast.error(eMsg)
        return
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
    return
  }
}
/**
 * @name    getBookmarkStatus
 * @desc    Check if a property is bookmarked
 * @route   POST /api/properties/bookmarks/status
 * @access  private
 */
export const getBookmarkStatus: Function = async (id: string): Promise<boolean | undefined> => {
  action = 'checking bookmark status'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(
        `${api}/properties/bookmarks/status`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        }
      )
      if (response.ok) {
        const data = await response.json()
        return data.bookmarked
      } else {
        toast.error(eMsg)
        return
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
    return
  }
}
/**
 * @name    getBookmarks
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarks
 * @access  private
 */
export const getBookmarks: Function = async (): Promise<ListedProperty[]> => {
  action = 'fetching bookmarked properties'
  if (api === '') {
    toast.error(noApiMsg)
    return []
  } else {
    try {
      const response: Response = await fetch('/api/properties/bookmarks')
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return []
      }
    } catch (error) {
      toast.error(eMsgPlus(error))
      return []
    }
  }
}