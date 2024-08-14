import Image from 'next/image'
import {ReactElement} from 'react'
const PropertyImages: React.FC<{images: string[]}> = (
  {images}: {images: string[]}
): ReactElement => (
  <section className='bg-blue-50 p-4'>
    <div className='container mx-auto'>
      {images.length === 1 ? (
        <Image
          src={images[0]}
          alt=''
          className='object-cover h-[400px] mx-auto rounded-xl'
          width={1800}
          height={400}
          priority={true}
        />
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          {images.map((
            image: string,
            index: number
          ) => {
            return (
              <div
                key={index}
                className={images.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'}
              >
                <Image
                  src={image}
                  alt=''
                  className='object-cover h-[400px] w-full rounded-xl'
                  width={1800}
                  height={400}
                  priority={true}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  </section>
)
export default PropertyImages