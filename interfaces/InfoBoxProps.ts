import ButtonProps from '@/interfaces/ButtonProps'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
export default interface InfoBoxProps extends DestructuredReactNode {
  heading: string
  bgColor?: string
  textColor?: string
  buttonProps: ButtonProps
}