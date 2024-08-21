import {toast} from 'react-toastify'
import {BookmarkStatusResponse, GeoCodingResponse, GetPropertiesResponse, InquiryMessage, ListedProperty} from '@/utilities/interfaces'
const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
const noApiMsg: string = 'NEXT_PUBLIC_API_DOMAIN is MISSING from `.env`.'
let activity: string = ''
const eMsg: string = `Error ${activity}.`
const eMsgPlus: Function = (error: any) => `Error ${activity}:\n${error}`
const getPropertiesError: GetPropertiesResponse = {
  properties: [],
  total: 0
}
/**
 * @name    getProperties
 * @desc    Get all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (page: number): Promise<GetPropertiesResponse> => {
  activity = 'retrieving properties'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return getPropertiesError
    } else {
      const response: Response = await fetch(`${api}/properties?page=${page}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return getPropertiesError
      }
    }
  } catch (error: any) {
    return getPropertiesError
  }
}
/**
 * @name    getProperty
 * @desc    Get a single property
 * @route   GET /api/properties/:id
 * @access  public
 */
export const getProperty: Function = async (id: string): Promise<ListedProperty | undefined> => {
  activity = 'retrieving property'
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
  activity = 'retrieving user\'s properties'
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
  activity = 'deleting property'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const property: ListedProperty | undefined = await getProperty(id)
      if (property) {
        const userProperties: ListedProperty[] = await getUserProperties(property.owner)
        if (window.confirm('Are you sure you want to delete this property?')) {
          const response: Response = await fetch(
            `${api}/properties/${id}`,
            {method: 'DELETE'}
          )
          response.ok ? toast.success('Property deleted.') : toast.error(eMsg)
          return userProperties
        } else {
          return userProperties
        }
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
 * @name    editProperty
 * @desc    Edit a property
 * @route   PUT /api/properties/:id
 * @access  private
 */
export const editProperty: Function = async (
  id: string,
  update: FormData
): Promise<void> => {
  activity = 'saving changes'
  try {
    if (api === '') {
      toast.error(noApiMsg)
    } else {
      (await fetch(
        `${api}/properties/${id}`, {
          method: 'PUT',
          body: update
        }
      )).ok ? toast.success('Property updated.') : toast.error(eMsg)
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
  }
}
/**
 * @name    toggleBookmark
 * @desc    Add or remove a bookmark
 * @route   PATCH /api/properties/bookmarks
 * @access  private
 */
export const toggleBookmark: Function = async (id: string): Promise<boolean | undefined> => {
  activity = 'adding/removing bookmark'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(
        `${api}/properties/bookmarks`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({propertyId: id})
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
 * @route   GET /api/properties/bookmarks/status/:id
 * @access  private
 */
export const getBookmarkStatus: Function = async (id: string): Promise<BookmarkStatusResponse | undefined> => {
  activity = 'checking bookmark status'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return
    } else {
      const response: Response = await fetch(`${api}/properties/bookmarks/status/${id}`)
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
 * @name    getBookmarks
 * @desc    Get all bookmarked properties
 * @route   GET /api/properties/bookmarks
 * @access  private
 */
export const getBookmarks: Function = async (): Promise<ListedProperty[]> => {
  activity = 'retrieving bookmarked properties'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const response: Response = await fetch('/api/properties/bookmarks')
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
 * @name    getPropertySearchResults
 * @desc    Get property search results
 * @route   GET /api/properties/search?location&type
 * @access  public
 */
export const getPropertySearchResults: Function = async (
  location: string,
  propertyType: string,
  page: number
): Promise<GetPropertiesResponse> => {
  activity = 'retrieving property search results'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return getPropertiesError
    } else {
      const response: Response = await fetch(`${api}/properties/search?location=${location}&type=${propertyType}&page=${page}`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return getPropertiesError
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
    return getPropertiesError
  }
}
/**
 * @name    getPropertyGeoCoordinates
 * @desc    Get a property's geolocation coordinates
 * @route   GET /api/properties/:id/coordinates
 * @access  public
 */
export const getPropertyGeoCoordinates: Function = async (id: string): Promise<GeoCodingResponse> => {
  activity = 'retrieving property geocoordinates'
  const geoCodingError: GeoCodingResponse = {
    lat: 'error',
    lng: 'error'
  }
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return geoCodingError
    } else {
      const response: Response = await fetch(`${api}/properties/${id}/coordinates`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return geoCodingError
      }
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
    return geoCodingError
  }
}
/**
 * @name    getMessages
 * @desc    Get messages
 * @route   GET /api/messages
 * @access  private
 */
export const getMessages: Function = async (): Promise<InquiryMessage[]> => {
  activity = 'retrieving messages'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const response: Response = await fetch(`${api}/messages`)
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
 * @name    switchMessageReadStatus
 * @desc    Mark a message as read or unread
 * @route   PATCH /api/messages/:id
 * @access  private
 */
export const switchMessageReadStatus: Function = async (id: string): Promise<boolean> => {
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return false
    } else {
      const response: Response = await fetch(
        `${api}/messages/${id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id})
        }
      )
      toast.success(response.json())
      return response.ok
    }
  } catch (error: any) {
    toast.error(eMsgPlus(error))
    return false
  }
}
/**
 * @name    deleteMessage
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  private
 */
export const deleteMessage: Function = async (id: string): Promise<boolean> => {
  activity = 'deleting bookmark'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return false
    } else {
      const response: Response = await fetch(
        `${api}/messages/${id}`,
        {method: 'DELETE'}
      )
      if (response.ok) {
        toast.success('Message deleted.')
        return true
      } else {
        toast.error(eMsg)
        return false
      }
    }
  } catch (error) {
    toast.error(eMsgPlus(error))
    return false
  }
}
/**
 * @name    getUnreadCount
 * @desc    Get the number of unread messages
 * @route   GET /api/messages/unreadCount
 * @access  private
 */
export const getUnreadCount: Function = async (): Promise<number> => {
  activity = 'retrieving unread message count'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return 0
    } else {
      const response: Response = await fetch(`${api}/messages/unreadCount`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return 0
      }
    }
  } catch (error) {
    toast.error(eMsgPlus(error))
    return 0
  }
}
/**
 * @name    getFeaturedProperties
 * @desc    Get featured properties
 * @route   GET /api/properties/featured
 * @access  public
 */
export const getFeaturedProperties: Function = async (): Promise<ListedProperty[]> => {
  activity = 'retrieving featured properties'
  try {
    if (api === '') {
      toast.error(noApiMsg)
      return []
    } else {
      const response: Response = await fetch(`${api}/properties/featured`)
      if (response.ok) {
        return response.json()
      } else {
        toast.error(eMsg)
        return []
      }
    }
  } catch (error) {
    toast.error(eMsgPlus(error))
    return []
  }
}