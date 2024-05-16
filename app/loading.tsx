'use client'
import {useEffect} from 'react'
import {ClipLoader} from 'react-spinners'
const LoadingPage: React.FC<boolean> = (loading: boolean) => {
  useEffect(() => {
    if (loading) document.title = 'Loading... | PropertyPulse | Find the Perfect Rental'
  }, [loading])
  return (
    <ClipLoader
      color='#3b82f6'
      loading={loading}
      cssOverride={{
        display: 'block',
        margin: '100px auto'
      }}
      size={150}
      aria-label='Loading Spinner'
    />
  )
}
export default LoadingPage