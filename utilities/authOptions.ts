import {Account, AuthOptions, Profile, Session, User} from 'next-auth'
import {ObjectId} from 'mongoose'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import {AuthorizationEndpointHandler, Provider} from 'next-auth/providers/index'
import {SignInAuthorizationParams} from 'next-auth/react'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {RegisteredUser, UserSession} from '@/utilities/interfaces'
const authOptions: AuthOptions = {
  providers: [
    Google<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '' as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' as string,
      authorization: {
        params: {
          prompt: 'consent' as string,
          access_type: 'offline' as string,
          response_type: 'code' as string
        } as SignInAuthorizationParams
      } as AuthorizationEndpointHandler
    }) as Provider
  ] as Provider[],
  callbacks: {
    async signIn(params: {
      user?: User | AdapterUser
      account?: Account | null
      profile?: Profile
      email?: {verificationRequest?: boolean}
      credentials?: CredentialInput
    }): Promise<boolean> {
      const {profile}: {profile?: Profile} = params
      await connectToMongoDB() as void
      const registeredUser: RegisteredUser | null = await userModel.findOne({email: profile?.email as string})
      if (!registeredUser) await userModel.create(profile as Profile)
      return true as boolean
    },
    async session(
      params: {
        session: Session
        token?: JWT
        user?: AdapterUser
      } & {
        newSession: UserSession
        trigger: 'update'
      }
    ): Promise<UserSession> {
      const {newSession}: {newSession: UserSession} = params
      if (newSession.user as RegisteredUser) {
        const registeredUser: RegisteredUser | null = await userModel.findOne({email: newSession.user.email as string})
        if (registeredUser) newSession.user._id = registeredUser._id as ObjectId
      }
      return newSession as UserSession
    }
  }
}
export default authOptions as AuthOptions