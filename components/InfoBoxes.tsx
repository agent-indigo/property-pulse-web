import {FunctionComponent, ReactElement} from 'react'
import InfoBox from '@/components/InfoBox'
const InfoBoxes: FunctionComponent = (): ReactElement => (
  <section>
    <div className='container-xl lg:container m-auto'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
        <InfoBox
          heading='For Renters'
          bgColor='bg-gray-100'
          buttonProps={{
            text: 'Browse Properties',
            url: '/properties',
            bgColor: 'bg-black'
          }}
        >
          Find your dream rental property.
          Bookmark properties and contact owners.
        </InfoBox>
        <InfoBox
          heading='For Property Owners'
          bgColor='bg-blue-100'
          buttonProps={{
            text: 'Add Property',
            url: '/properties/add',
            bgColor: 'bg-blue-500'
          }}
        >
          List your properties and reach potential renters.
          Rent as an Airbnb or long term.
        </InfoBox>
      </div>
    </div>
  </section>
)
export default InfoBoxes