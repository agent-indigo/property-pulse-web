import Image from 'next/image'
import {FunctionComponent, ReactElement} from 'react'
import {Gallery, Item} from 'react-photoswipe-gallery'
import {Images} from '@/utilities/interfaces'
const PropertyImages: FunctionComponent<Images> = ({images}): ReactElement => {
  const image: string = images[0]
  return (
    <Gallery>
      <section className='bg-blue-50 p-4'>
        <div className='container mx-auto'>
          {images.length === 1 ? (
            <Item
              original={image}
              thumbnail={image}
              width={1000}
              height={600}
            >
              {({ref, open}): ReactElement => (
                <Image
                  ref={ref}
                  onClick={open}
                  src={image}
                  alt=''
                  className='object-cover h-[400px] mx-auto rounded-xl'
                  width={1800}
                  height={400}
                  priority={true}
                />
              )}
            </Item>
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              {images.map((image: string, index: number): ReactElement => (
                <div
                  key={index}
                  className={images.length === 3 && index === 2 ? 'col-span-2' : 'col-span-1'}
                >
                  <Item
                    original={image}
                    thumbnail={image}
                    width={1000}
                    height={600}
                  >
                    {({ref, open}): ReactElement => (
                      <Image
                        ref={ref}
                        onClick={open}
                        src={image}
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
  )
}
export default PropertyImages