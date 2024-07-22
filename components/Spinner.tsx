import {ReactElement} from 'react'
import {ClipLoader} from 'react-spinners'
const Spinner: React.FC<{loading: boolean}> = ({loading}: {loading: boolean}): ReactElement => (
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