import {connect, set} from 'mongoose'
const connectToMongoDB: Function = async (): Promise<void> => {
  let connected: boolean = false
  if (!connected) try {
    set('strictQuery',true)
    await connect(`mongodb+srv://${
      process.env.MONGODB_USER ?? ''
    }:${
      process.env.MONGODB_PASSWORD ?? ''
    }@${
      process.env.MONGODB_HOST ?? 'localhost'
    }/${
      process.env.MONGODB_DATABASE ?? 'PropertyPulse'
    }?retryWrites=true&w=majority`)
    connected = true
    console.log('MongoDB successfully connected.')
  } catch (error: any) {
    console.error(error.toString())
  }
}
export default connectToMongoDB