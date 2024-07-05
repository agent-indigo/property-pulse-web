import {ReactElement} from 'react'
import InfoBox from '@/components/InfoBox'
import {ButtonProps} from '@/utilities/interfaces'
const InfoBoxes: React.FC = (): ReactElement => {
  return (
    <section>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <InfoBox
            heading='For Renters'
            backgroundColor='bg-gray-100'
            buttonInfo={{
              text: 'Browse Properties' as string,
              link: '/properties' as string,
              backgroundColor: 'bg-black' as string
            } as ButtonProps}
          >
            Find your dream rental property.
            Bookmark properties and contact owners.
          </InfoBox>
          <InfoBox
            heading='For Property Owners'
            backgroundColor='bg-blue-100'
            buttonInfo={{
              text: 'Add Property' as string,
              link: '/properties/add' as string,
              backgroundColor: 'bg-blue-500' as string
            } as ButtonProps}
          >
            List your properties and reach potential renters.
            Rent as an Airbnb or long term.
          </InfoBox>
        </div>
      </div>
    </section>
  )
}
export default InfoBoxes as React.FC