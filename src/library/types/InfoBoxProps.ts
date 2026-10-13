import {PropsWithChildren} from 'react'
import ButtonProps from '@/types/ButtonProps'
export default interface InfoBoxProps extends PropsWithChildren {
  heading: string
  bgColor?: string
  textColor?: string
  buttonProps: ButtonProps
}