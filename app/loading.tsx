'use client'
import {ClipLoader} from 'react-spinners'
const Spinner: React.FC<boolean> = (loading: boolean) => {
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
export default Spinner