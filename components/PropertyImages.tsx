import Image from 'next/image'
import {ReactElement} from 'react'
const PropertyImages: React.FC<{images: string[]}> = ({images}: {images: string[]}): ReactElement => {
  return (
    <section className='bg-blue-50 p-4'>
      <div className="container mx-auto">
        {images.length as number === 1 as number ? (
          <Image
            src={images[0]}
            alt=''
            className='object-cover h-[400px] mx-auto rounded-xl'
            width={1800 as number}
            height={400 as number}
            priority={true as boolean}
          />
        ) as ReactElement : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image: string, index: number) => {
              return (
                <div
                  key={index as number}
                  className={`${images.length as number === 3 as number && index as number === 2 as number ? 'col-span-2' as string : 'col-span-1' as string}` as string}
                >
                  <Image
                    src={image as string}
                    alt=''
                    className='object-cover h-[400px] w-full rounded-xl'
                    width={1800 as number}
                    height={400 as number}
                    priority={true as boolean}
                  />
                </div>
              ) as ReactElement
            })}
          </div>
        )}
      </div>
    </section>
  ) as ReactElement
}
export default PropertyImages as React.FC<{images: string[]}>