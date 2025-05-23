'use client'
import {
  FunctionComponent,
  ReactElement
} from 'react'
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookShareCount,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  XIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share'
import DestructuredProperty from '@/types/DestructuredProperty'
import PlainProperty from '@/types/PlainProperty'
const ShareButtons: FunctionComponent<DestructuredProperty> = ({property}): ReactElement => {
  const {
    _id,
    name,
    type
  }: PlainProperty = property
  const url: string = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${_id}`
  return (
    <>
      <h3 className='text-xl font-bold text-center pt-2'>
        Share
      </h3>
      <div className='flex gap-3 justify-center pb-5'>
        <FacebookShareButton
          url={url}
          title={name}
          hashtag={`${type?.replace(/\s/g, '')}ForRent`}
        >
          <FacebookIcon
            size={40}
            round={true}
          >
            <FacebookShareCount url={url}/>
          </FacebookIcon>
        </FacebookShareButton>
        <FacebookMessengerShareButton
          url={url}
          title={name}
          appId={process.env.FACEBOOK_MESSENGER_APP_ID ?? ''}
        >
          <FacebookMessengerIcon
            size={40}
            round={true}
          />
        </FacebookMessengerShareButton>
        <WhatsappShareButton
          url={url}
          title={name}
          separator=':: '
        >
          <WhatsappIcon
            size={40}
            round={true}
          />
        </WhatsappShareButton>
        <TwitterShareButton
          url={url}
          title={name}
          hashtags={[`${type?.replace(/\s/g, '')}ForRent`]}
        >
          <XIcon
            size={40}
            round={true}
          />
        </TwitterShareButton>
        <EmailShareButton
          url={url}
          subject={`${name} for rent`}
          body={`I thought this ${type} might meet your needs:\n${name}\n${url}`}
        >
          <EmailIcon
            size={40}
            round={true}
          />
        </EmailShareButton>
      </div>
    </>
  )
}
export default ShareButtons