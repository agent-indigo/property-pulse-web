import Link from 'next/link'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import InfoBoxProps from '@/types/InfoBoxProps'
import ButtonProps from '@/types/ButtonProps'
const InfoBox: FunctionComponent<InfoBoxProps> = ({
  heading,
  bgColor = 'bg-gray-100',
  textColor = 'text-gray-800',
  buttonProps,
  children
}): ReactElement => {
  const {
    url,
    bgColor: buttonBgColor,
    text
  }: ButtonProps = buttonProps
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md`}>
      <h2 className={`${textColor} text-2xl font-bold`}>
        {heading}
      </h2>
      <p className={`${textColor} mt-2 mb-4`}>
        {children}
      </p>
      <Link
        href={url}
        className={`inline-block ${
          buttonBgColor
        } text-white rounded-lg px-4 py-2 hover:opacity-80`}
      >
        {text}
      </Link>
    </div>
  )
}
export default InfoBox