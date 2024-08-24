'use server'
import {revalidatePath} from 'next/cache'
import {ActionResult} from 'next/dist/server/app-render/types'
import {redirect} from 'next/navigation'
import {UploadApiResponse} from 'cloudinary'
import {Document, ObjectId} from 'mongoose'
import messageModel from '@/models/messageModel'
import getSessionUser from '@/utilities/getSessionUser'
import {InquiryMessage, ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import cloudinary from '@/utilities/cloudinary'
import propertyModel from '@/models/propertyModel'
export const sendMessage: Function = async (
  previousState: FormData,
  form: FormData
): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const sender: string = user.id ?? ''
      const recipient: string = form.get('recipient')?.valueOf().toString() ?? ''
        if (sender !== '' && recipient !== '') {
          if (sender !== recipient) {
            const message: Document<unknown, {}, InquiryMessage> & InquiryMessage & Required<{_id: ObjectId;}> = new messageModel({
              sender,
              recipient,
              property: form.get('property'),
              name: form.get('name'),
              email: form.get('email'),
              phone: form.get('phone'),
              body: form.get('body'),
              read: false
            })
            await connectToMongoDB()
            await message.save()
            revalidatePath('/messages', 'page')
            return {
              message: 'Message sent',
              success: true
            }
          } else {
            return {
              error: '400: You can\'t send yourself a message.',
              success: false
            }
          }
        } else {
          return {
            error: '500: Internal Server Error',
            success: false
          }
        }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const addProperty: Function = async (form: FormData): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const images: string[] = []
      const imageIds: string[] = []
      await Promise.all(form.getAll('files').map(async (image: FormDataEntryValue): Promise<void> => {
        const {secure_url, public_id}: UploadApiResponse = await cloudinary.uploader.upload(
          `data:image/png;base64,${Buffer.from(new Uint8Array(await (image as File).arrayBuffer())).toString('base64')}`,
          {folder: process.env.CLOUDINARY_FOLDER_NAME ?? ''}
        )
        images.push(secure_url)
        imageIds.push(public_id)
      }))
      const property: Document<unknown, {}, ListedProperty> & ListedProperty & Required<{_id: ObjectId}> = new propertyModel({
        owner: user._id,
        type: form.get('type')?.valueOf(),
        name: form.get('name')?.valueOf(),
        description: form.get('description')?.valueOf(),
        location: {
          street: form.get('location.street')?.valueOf(),
          city: form.get('location.city')?.valueOf(),
          state: form.get('location.state')?.valueOf(),
          zipcode: form.get('location.zipcode')?.valueOf()
        },
        beds: form.get('beds')?.valueOf(),
        baths: form.get('baths')?.valueOf(),
        square_feet: form.get('square_feet')?.valueOf(),
        amenities: form.getAll('amenities').map((amenity: FormDataEntryValue): string => amenity.valueOf().toString()),
        rates: {
          nightly: form.get('rates.nightly')?.valueOf(),
          weekly: form.get('rates.weekly')?.valueOf(),
          monthly: form.get('rates.monthly')?.valueOf()
        },
        seller_info: {
          name: form.get('seller_info.name')?.valueOf(),
          email: form.get('seller_info.email')?.valueOf(),
          phone: form.get('seller_info.phone')?.valueOf()
        },
        images,
        imageIds
      })
      await connectToMongoDB()
      await property.save()
      revalidatePath('/', 'layout')
      redirect(`/properties/${property.id}`)
    } else {
      return {
        error: '401: Unauthorized.',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const toggleBookmark: Function = async (propertyId: string): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(propertyId)
      if (property) {
        if (user.id !== property.owner?.toString()) {
          let action: string = 'adding/removing'
          let bookmarked: boolean | undefined = user.bookmarks?.includes(propertyId)
          let message: string
          if (bookmarked) {
            user.bookmarks = user.bookmarks?.filter((bookmark: any): boolean => bookmark.toString() !== propertyId)
            message = 'Bookmark removed.'
            bookmarked = false
            action = 'removing'
          } else {
            user.bookmarks?.push(propertyId)
            message = 'Property bookmarked.'
            bookmarked = true
            action = 'adding'
          }
          await user.save()
          return {
            message,
            bookmarked,
            success: true
          }
        } else {
          return {
            error: '400: You can\'t bookmark your own property.',
            success: false
          }
        }
      } else {
        return {
          error: '404: Property Fot Found',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const getBookmarkStatus: Function = async (propertyId: string): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    return user ? {
      bookmarked: user.bookmarks?.includes(propertyId),
      success: true
    } : {
      error: '401: Unauthorized',
      success: false
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const deleteMessage: Function = async (messageId: string): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      const message: InquiryMessage | null = await messageModel.findById(messageId)
      if (message) {
        if (user.id === message.recipient.toString()) {
          await connectToMongoDB()
          await messageModel.findByIdAndDelete(messageId)
          revalidatePath('/messages', 'page')
          return {
            message: 'Message deleted.',
            success: true
          }
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Message Not Found',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const deleteProperty: Function = async (propertyId: string): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(propertyId)
      if (property) {
        if (user.id === property.owner?.toString()) {
          property.imageIds?.map(async (id: string): Promise<void> => await cloudinary.uploader.destroy(id))
          await propertyModel.findByIdAndDelete(propertyId)
          revalidatePath('/', 'layout')
          return {
            message: 'Property deleted.',
            success: true
          }
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Property Not Found',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const getUnreadMessagesCount: Function = async (): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      return {
        unreadMessagesCount: await messageModel.countDocuments({
          recipient: user._id,
          read: false
        }),
        success: true
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const toggleMessageReadStatus: Function = async (messageId: string): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      const message: InquiryMessage | null = await messageModel.findById(messageId)
      if (message) {
        if (user.id === message.recipient.toString()) {
          const {
            sender,
            recipient,
            property,
            name,
            email,
            phone,
            body,
            read
          }: InquiryMessage = message
          const update: InquiryMessage = {
            sender,
            recipient,
            property,
            name,
            email,
            phone,
            body,
            read: !read
          }
          await messageModel.findByIdAndUpdate(messageId, update)
          revalidatePath('/messages', 'page')
          return {
            message: `Message marked as ${read ? 'unread' : 'read'}.`,
            read: !read,
            success: true
          }
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Message Not Found',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}
export const editProperty: Function = async (
  propertyId: string,
  update: ListedProperty
): Promise<ActionResult> => {
  try {
    const user: RegisteredUser | undefined = await getSessionUser()
    if (user) {
      await connectToMongoDB()
      const property: ListedProperty | null = await propertyModel.findById(propertyId)
      if (property) {
        if (user.id === property.owner?.toString()) {
          await propertyModel.findByIdAndUpdate(propertyId, update)
          revalidatePath('/', 'layout')
          redirect(`/properties/${propertyId}`)
        } else {
          return {
            error: '401: Unauthorized',
            success: false
          }
        }
      } else {
        return {
          error: '404: Property Not Found',
          success: false
        }
      }
    } else {
      return {
        error: '401: Unauthorized',
        success: false
      }
    }
  } catch (error: any) {
    return {
      error,
      success: false
    }
  }
}