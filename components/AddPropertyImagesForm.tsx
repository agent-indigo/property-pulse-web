'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'react-toastify'
import SubmitButton from '@/components/SubmitButton'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const AddPropertyImagesForm: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {_id}: PlainProperty = property
  const router: AppRouterInstance = useRouter()
  const handleSubmit: Function = async (body: FormData): Promise<void> => {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/properties/${_id}/images`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    if (response.ok) {
      toast.success('Images added.')
      router.push(`/properties/${_id}`)
    } else {
      toast.error(await response.text())
    }
  }
  return (
    <form action={handleSubmit.bind(null)}>
      <h2 className='text-3xl text-center font-semibold mb-6'>
        Add Images
      </h2>
      <input
        type='file'
        id='files'
        name='files'
        accept='image/*'
        multiple
        required
        className='border rounded w-full py-2 px-3'
      />
      <SubmitButton
        message='Adding...'
        action='Add Images'
      />
    </form>
  )
}
export default AddPropertyImagesForm