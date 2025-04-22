'use client'
import {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  ReactElement,
  useState
} from 'react'
import Image from 'next/image'
import {
  Gallery,
  Item
} from 'react-photoswipe-gallery'
import {toast} from 'react-toastify'
import {FaTimes} from 'react-icons/fa'
import {useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const DeletePropertyImagesForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const router: AppRouterInstance = useRouter()
  const {
    _id,
    images,
    imageIds
  }: PlainProperty = property
  const imageUrl: string = images[0]
  const [
    remaining,
    setRemaining
  ] = useState<string[]>(images)
  const [
    selected,
    setSelected
  ] = useState<string[]>([])
  const deleteHandler: Function = async (imageId: string): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/${_id}/images/${imageId}`,{
        method: 'DELETE'
      }
    )
    if (response.ok) {
      setSelected(selected.filter((id: string): boolean => id !== imageId))
      setRemaining(remaining.filter((id: string): boolean => id !== imageId))
      toast.success(`Image ${imageId} deleted.`)
      remaining.length === 1 && router.push(`/properties/${_id}/images/add`)
    } else {
      toast.error(`Error deleting image ${imageId}: ${await response.text()}`)
    }
  }
  const deleteAllHandler: Function = async (): Promise<void> => {
    await Promise.all(imageIds.map(async (imageId: string): Promise<void> => await deleteHandler(imageId)))
  }
  const deleteSelectedHandler: Function = async (): Promise<void> => {
    await Promise.all(selected.map(async (imageId: string): Promise<void> => await deleteHandler(imageId)))
  }
  const checkBoxHandler: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>): void => event.target.checked ? setSelected([
    ...selected,
    event.target.value
  ]) : setSelected(selected.filter((id: string): boolean => id !== event.target.value))
  return (
    <>
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Delete Images
      </h2>
      <div>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded-md mr-2'
          onClick={async (): Promise<void> => await deleteAllHandler()}
        >
          Delete All
        </button>
        <button
          className='bg-red-500 text-white px-4 py-2 rounded-md'
          onClick={async (): Promise<void> => await deleteSelectedHandler()}
        >
          Delete Selected
        </button>
      </div>
      <Gallery>
        <section className='bg-blue-50 p-4'>
          <div className='container mx-auto'>
            {images.length === 1 ? (
              <>
                <input
                  type='checkbox'
                  value={imageIds.filter((imageId: string): boolean => imageUrl.includes(imageId))}
                  onChange={checkBoxHandler}
                />
                <button onClick={async (): Promise<void> => await deleteHandler(imageIds.filter((imageId: string): boolean => imageUrl.includes(imageId))[0])}>
                  <FaTimes className='text-red-500 hover:text-red-700'/>
                </button>
                <Item
                  original={imageUrl}
                  thumbnail={imageUrl}
                  width={1000}
                  height={600}
                >
                  {({
                    ref,
                    open
                  }): ReactElement => (
                    <Image
                      ref={ref}
                      onClick={open}
                      src={imageUrl}
                      alt=''
                      className='object-cover h-[400px] mx-auto rounded-xl'
                      width={1800}
                      height={400}
                      priority={true}
                    />
                  )}
                </Item>
              </>
            ) : (
              <div className='flex justify-between mb-4'>
                {images.map((
                  imageUrl: string,
                  index: number
                ): ReactElement => (
                  <div
                    key={index}
                    className={
                      images.length === 3 && index === 2
                      ? 'col-span-2'
                      : 'col-span-1'
                    }
                  >
                    <input
                      type='checkbox'
                      value={imageIds.filter((imageId: string): boolean => imageUrl.includes(imageId))}
                      onChange={checkBoxHandler}
                    />
                    <button onClick={async (): Promise<void> => await deleteHandler(imageIds.filter((imageId: string): boolean => imageUrl.includes(imageId))[0])}>
                      <FaTimes className='text-red-500 hover:text-red-700'/>
                    </button>
                    <Item
                      original={imageUrl}
                      thumbnail={imageUrl}
                      width={1000}
                      height={600}
                    >
                      {({
                        ref,
                        open
                      }): ReactElement => (
                        <Image
                          ref={ref}
                          onClick={open}
                          src={imageUrl}
                          alt=''
                          className='object-cover h-[400px] w-full rounded-xl'
                          width={1800}
                          height={400}
                          priority={true}
                        />
                      )}
                    </Item>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </Gallery>
    </>
  )
}
export default DeletePropertyImagesForm