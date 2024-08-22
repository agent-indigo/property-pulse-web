'use client'
import {FunctionComponent, ReactElement} from 'react'
import {Provider} from 'react-redux'
import {ReactNodes} from '@/utilities/interfaces'
import store from '@/utilities/store'
const StateProvider: FunctionComponent<ReactNodes> = ({children}): ReactElement => (
  <Provider store={store}>
    {children}
  </Provider>
)
export default StateProvider