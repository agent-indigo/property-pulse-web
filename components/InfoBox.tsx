import Link from 'next/link'
import {ReactElement, ReactNode} from 'react'
import {InfoBoxProps} from '@/utilities/interfaces'
const InfoBox: React.FC<InfoBoxProps> = ({
  heading,
  backgroundColor = 'bg-gray-100' as string,
  textColor = 'text-gray-800' as string,
  buttonInfo,
  children
}): ReactElement => {
  return (
    <div className={`${backgroundColor as string} p-6 rounded-lg shadow-md` as string}>
      <h2 className={`${textColor as string} text-2xl font-bold` as string}>{heading as string}</h2>
      <p className={`${textColor as string} mt-2 mb-4` as string}>{children as ReactNode}</p>
      <Link
        href={buttonInfo.link as string}
        className={`inline-block ${buttonInfo.backgroundColor as string} text-white rounded-lg px-4 py-2 hover:opacity-80` as string}
      >
        {buttonInfo.text as string}
      </Link>
    </div>
  ) as ReactElement
}
export default InfoBox as React.FC<InfoBoxProps>