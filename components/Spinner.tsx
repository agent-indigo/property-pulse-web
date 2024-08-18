import {FunctionComponent, ReactElement} from 'react'
import {ClipLoader} from 'react-spinners'
import {SpinnerProps} from '@/utilities/interfaces'
const Spinner: FunctionComponent<SpinnerProps> = (
  {loading}
): ReactElement => (
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
export default Spinner