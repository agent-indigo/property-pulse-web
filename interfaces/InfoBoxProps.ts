import ButtonProps from '@/interfaces/ButtonProps'
import DestructuredReactNode from '@/interfaces/DestructuredReactNode'
interface InfoBoxProps extends DestructuredReactNode {
  heading: string
  bgColor?: string
  textColor?: string
  buttonProps: ButtonProps
}
export default InfoBoxProps