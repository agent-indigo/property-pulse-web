'use client' as string
import {ClientSafeProvider, LiteralUnion, SignInResponse} from 'next-auth/react'
import {BuiltInProviderType} from 'next-auth/providers/index'
import {ReactElement, useEffect, useState} from 'react'
import Image, {StaticImageData} from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {Session} from 'next-auth'
import {signIn, signOut, useSession, getProviders} from 'next-auth/react'
import {FaGoogle} from 'react-icons/fa'
import logo from '@/assets/images/logo-white.png'
import profileDefault from '@/assets/images/profile.png'
const Navbar: React.FC = (): ReactElement => {
  const {data: session}: {data: Session | null} = useSession<boolean>() as {data: Session | null}
  const profileImage: string | null | undefined = session?.user?.image as string | undefined | null
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false)
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null)
  const pathname: string = usePathname() as string
  useEffect((): void => {
    const setAuthProviders: Function = async (): Promise<void> => {
      const response: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null = await getProviders() as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null
      setProviders(response as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null) as void
    }
    setAuthProviders() as void
  }, []) as void
  return (
    <nav className='bg-blue-700 border-b border-blue-500'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-20 items-center justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center md:hidden'>
            {/* mobile menu button */}
            <button
              type='button'
              id='mobile-dropdown-button'
              className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded='false'
              onClick={(): void => setIsMobileMenuOpen((previousValue: boolean) => !previousValue as boolean) as void}
            >
              <span className='absolute -inset-0.5'></span>
              <span className='sr-only'>
                Open main menu
              </span>
              <svg
                className='block h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>
          <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
            {/* logo */}
            <Link
              href='/'
              className='flex flex-shrink-0 items-center'
            >
              <Image
                className='h-10 w-auto'
                src={logo as StaticImageData}
                alt='PropertyPulse'
              />
              <span className='hidden md:block text-white text-2xl font-bold ml-2'>
                PropertyPulse
              </span>
            </Link>
            {/* desktop menu (hidden on smaller-than-md screens) */}
            <div className='hidden md:ml-6 md:block'>
              <div className='flex space-x-2'>
                <Link
                  href='/'
                  className={`${pathname as string === '/' as string ? 'bg-black' as string : '' as string} text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2` as string}
                >
                  Home
                </Link>
                <Link
                  href='/properties'
                  className={`${pathname as string === '/properties' as string ? 'bg-black' as string : '' as string} text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2` as string}
                >
                  Properties
                </Link>
                {session && (
                  <Link
                    href='/properties/add'
                    className={`${pathname as string === '/properties/add' as string ? 'bg-black' as string : '' as string} text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2` as string}
                  >
                    Add Property
                  </Link>
                )}
              </div>
            </div>
          </div>
          {/* user menu (logged out) */}
          {!session as boolean && (
            <div className='hidden md:block md:ml-6'>
              <div className='flex items-center'>
                {providers as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null && Object.values(providers as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>).map((provider: ClientSafeProvider, index: number) => (
                  <button
                    key={index as number}
                    onClick={(): Promise<SignInResponse> => signIn(provider.id as string) as Promise<SignInResponse>}
                    className='flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
                  >
                    <FaGoogle className='text-white mr-2'/>
                    <span>
                      Log In or Register
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* user menu (logged in) */}
          {session as Session && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0'>
              <Link
                href='/messages'
                className='relative group'
              >
                <button
                  type='button'
                  className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                >
                  <span className='absolute -inset-1.5'></span>
                  <span className='sr-only'>
                    View notifications
                  </span>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                    />
                  </svg>
                </button>
                <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
                  2
                  {/* replace with the actual number of notifications */}
                </span>
              </Link>
              {/* profile dropdown button */}
              <div className='relative ml-3'>
                <div>
                  <button
                    type='button'
                    className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                    id='user-menu-button'
                    aria-expanded='false'
                    aria-haspopup='true'
                    onClick={():void => setIsProfileMenuOpen((previousValue: boolean) => !previousValue as boolean) as void}
                  >
                    <span className='absolute -inset-1.5'></span>
                    <span className='sr-only'>
                      Open user menu
                    </span>
                    <Image
                      className='h-8 w-8 rounded-full'
                      src={profileImage as string || profileDefault as StaticImageData}
                      alt=''
                      width={40 as number}
                      height={40 as number}
                    />
                  </button>
                </div>
                {/* profile dropdown */}
                {isProfileMenuOpen as boolean && (
                  <div
                    id='user-menu'
                    className='hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu-button'
                    tabIndex={-1 as number}
                  >
                    <Link
                      href='/profile'
                      className='block px-4 py-2 text-sm text-gray-700'
                      role='menuitem'
                      tabIndex={-1 as number}
                      id='user-menu-item-0'
                      onClick={(): void => setIsProfileMenuOpen(false as boolean) as void}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href='/properties/bookmarked'
                      className='block px-4 py-2 text-sm text-gray-700'
                      role='menuitem'
                      tabIndex={-1 as number}
                      id='user-menu-item-2'
                      onClick={(): void => setIsProfileMenuOpen(false as boolean) as void}
                    >
                      Bookmarked Properties
                    </Link>
                    <Link
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700'
                      role='menuitem'
                      tabIndex={-1 as number}
                      id='user-menu-item-2'
                      onClick={(): void => {
                        setIsProfileMenuOpen(false as boolean) as void
                        signOut() as Promise<void>
                      }}
                    >
                      Log Out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen as boolean && (
        <div id='mobile-menu'>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            <Link
              href='/'
              className={`${pathname as string === '/' as string ? 'bg-black' as string : '' as string} text-white block rounded-md px-3 py-2 text-base font-medium` as string}
            >
              Home
            </Link>
            <Link
              href='/properties'
              className={`${pathname as string === '/properties' as string ? 'bg-black' as string : '' as string} text-white block rounded-md px-3 py-2 text-base font-medium` as string}
            >
              Properties
            </Link>
            {session as Session && (
              <Link
                href='/properties/add'
                className={`${pathname as string === '/properties/add' as string ? 'bg-black' as string : '' as string} text-white block rounded-md px-3 py-2 text-base font-medium` as string}
              >
                Add Property
              </Link>
            )}
            {!session as boolean && providers as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null && Object.values(providers as Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>).map((provider: ClientSafeProvider, index: number) => (
              <button
                key={index as number}
                onClick={(): Promise<SignInResponse> => signIn(provider.id as string) as Promise<SignInResponse>}
                className='flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
              >
                <FaGoogle className='text-white mr-2'/>
                <span>
                  Log In or Register
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  ) as ReactElement
}
export default Navbar as React.FC