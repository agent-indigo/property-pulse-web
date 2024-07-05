import {CSSProperties, ReactElement} from 'react'
import {ClipLoader} from 'react-spinners'
const Spinner: React.FC<{loading: boolean}> = ({loading}: {loading: boolean}): ReactElement => {
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
export default Spinner as React.FC<{loading: boolean}>