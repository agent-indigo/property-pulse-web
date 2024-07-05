import Image from 'next/image'
import {ReactElement} from 'react'
const PropertyHeaderImage: React.FC<{image: string}> = ({image}: {image: string}): ReactElement => {
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          <Image
            src={image as string}
            alt=''
            className='object-cover h-[400px] w-full'
            width={0 as number}
            height={0 as number}
            sizes='100vw'
          />
        </div>
      </div>
    </section>
  ) as ReactElement
}
export default PropertyHeaderImage as React.FC<{image: string}>