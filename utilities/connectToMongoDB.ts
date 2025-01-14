import {
  connect,
  set
} from 'mongoose'
const connectToMongoDB: Function = async (): Promise<void> => {
  let connected: boolean = false
  if (!connected) try {
    set(
      'strictQuery',
      true
    )
    const host: string = process.env.MONGODB_HOST ?? 'localhost'
    await connect(`mongodb${host === 'localhost' ? '' : '+srv'}://${
      process.env.MONGODB_USER ?? ''
    }:${
      process.env.MONGODB_PASSWORD ?? ''
    }@${host}${host === 'localhost' ? `:${
      process.env.MONGODB_PORT ?? '27017'
    }` : ''}/${
      process.env.MONGODB_DATABASE ?? 'PropertyPulse'
    }?retryWrites=true&w=majority`)
    connected = true
    console.log('MongoDB successfully connected.')
  } catch (error: any) {
    console.error(error.toString())
  }
}
export default connectToMongoDB