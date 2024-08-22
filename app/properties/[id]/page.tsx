'use client'
import Link from 'next/link'
import {useParams, useRouter} from 'next/navigation'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {Params} from 'next/dist/shared/lib/router/utils/route-matcher'
import {FunctionComponent, ReactElement, useEffect, useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import {IdFromUrl, ListedProperty} from '@/utilities/interfaces'
import {getProperty} from '@/utilities/requests'
import Spinner from '@/components/Spinner'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyDetails from '@/components/PropertyDetails'
import PropertyImages from '@/components/PropertyImages'
import BookmarkButton from '@/components/BookmarkButton'
import ShareButtons from '@/components/ShareButtons'
import ContactForm from '@/components/ContactForm'
const PropertyPage: FunctionComponent = (): ReactElement | null => {
  const router: AppRouterInstance = useRouter()
  const params: Params = useParams()
  const {id}: IdFromUrl = params
  const [property, setProperty] = useState<ListedProperty | null>(null)
  const [headerImage, setHeaderImage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(
    (): void => {
      const getPropertyData: Function = async (): Promise<void> => {
        const property: ListedProperty | undefined = await getProperty(id)
        if (property) {
          document.title = `${property.name} | PropertyPulse | Find the Perfect Rental`
          setProperty(property)
          setHeaderImage(property.images?.[0] ?? '')
        }
        setLoading(false)
      }
      if (!property) loading ? getPropertyData() : router.push('/not-found')
    },
    [params, property, loading, router, id]
  )
  return loading ? <Spinner loading={loading}/> : property && (
    <>
      <PropertyHeaderImage image={headerImage}/>
      <section>
        <div className='container m-auto py-6 px-6'>
          <Link
            href='/properties?page=1'
            className='text-blue-500 hover:text-blue-600 flex items-center'
          >
            <FaArrowLeft className='mr-2'/> Back to Properties
          </Link>
        </div>
      </section>
      <section className='bg-blue-50'>
        <div className='container m-auto py-10 px-6'>
          <div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
            <PropertyDetails property={property}/>
            {/* Sidebar */}
            <aside className='space-y-4'>
              <BookmarkButton property={property}/>
              <ShareButtons property={property}/>
              <ContactForm property={property}/>
            </aside>
          </div>
        </div>
      </section>
      <PropertyImages images={property?.images as string[]}/>
    </>
  )
}
export default PropertyPage