'use client' as string
import {CSSProperties, ReactElement, useEffect} from 'react'
import {ClipLoader} from 'react-spinners'
const LoadingPage: React.FC<boolean> = (loading: boolean): ReactElement => {
  useEffect((): void => {
    if (loading as boolean) document.title = 'Loading... | PropertyPulse | Find the Perfect Rental' as string
  }, [loading]) as void
  return (
    <ClipLoader
      color='#3b82f6'
      loading={loading as boolean}
      cssOverride={{
        display: 'block' as string,
        margin: '100px auto' as string
      } as CSSProperties}
      size={150 as number}
      aria-label='Loading Spinner'
    />
  ) as ReactElement
}
export default LoadingPage as React.FC<boolean>