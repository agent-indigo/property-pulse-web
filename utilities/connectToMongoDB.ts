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
    const hostIsLocal: boolean = host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.16.') || host.startsWith('fe80:') || host.startsWith('fd00:')
    await connect(`mongodb${hostIsLocal ? '' : '+srv'}://${
      process.env.MONGODB_USER ?? ''
    }:${
      process.env.MONGODB_PASSWORD ?? ''
    }@${host}${hostIsLocal ? `:${
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