import {connect, set} from 'mongoose'
const connectToMongoDB: Function = async (): Promise<void> => {
  let connected: boolean = false
  if (!connected) try {
    const {
      MONGODB_USER,
      MONGODB_PASSWORD,
      MONGODB_HOST,
      MONGODB_DATABASE
    } = process.env
    set('strictQuery',true)
    await connect(`mongodb+srv://${
      MONGODB_USER ?? ''
    }:${
      MONGODB_PASSWORD ?? ''
    }@${
      MONGODB_HOST ?? ''
    }/${
      MONGODB_DATABASE ?? ''
    }?retryWrites=true&w=majority`)
    connected = true
    console.log('MongoDB successfully connected.')
  } catch (error: any) {
    console.error(error.toString())
  }
}
export default connectToMongoDB