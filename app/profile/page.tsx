import {
  FunctionComponent,
  ReactElement
} from 'react'
import Image from 'next/image'
import {Metadata} from 'next'
import {getServerSession} from 'next-auth'
import profileDefault from '@/assets/images/profile.png'
import ProfileProperties from '@/components/ProfileProperties'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import PlainProperty from '@/interfaces/PlainProperty'
import UserDocument from '@/interfaces/UserDocument'
import userModel from '@/models/userModel'
export const metadata: Metadata = {
  title: 'Profile'
}
const ProfilePage: FunctionComponent =  async (): Promise<ReactElement> => {
  await connectToMongoDB()
  const user: UserDocument | null = await userModel.findOne({
    email: (await getServerSession())?.user?.email
  })
  const properties: PlainProperty[] = JSON.parse(JSON.stringify(await propertyModel.find({
    owner: user?.id
  }).lean()))
  return (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>
            Your Profile
          </h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                  src={user?.image ?? profileDefault}
                  width={200}
                  height={200}
                  alt='User'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                {user?.username}
              </h2>
              <h2 className='text-2xl mb-4'>
                {user?.email}
              </h2>
            </div>
            <div className='md:w-3/4 md:pl-4'>
              <h2 className='text-xl font-semibold mb-4'>
                Your Listings
              </h2>
              {properties.length === 0 ? (
                <p>
                  You have no listings.
                </p>
              ) : (
                <ProfileProperties properties={properties}/>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ProfilePage