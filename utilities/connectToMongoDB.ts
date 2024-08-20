import {connect, Mongoose, set} from 'mongoose'
const connectToMongoDB: Function = async (): Promise<void> => {
  let connected: boolean = false
  set('strictQuery', true)
  if (connected) {
    console.log('MongoDB already connected.')
  } else {
    try {
      const connection: Mongoose = await connect(process.env.MONGODB_URI ?? '')
      connected = true
      console.log(`MongoDB connection successful:\n${connection.connection.host}`)
    } catch (error: any) {
      console.error(`Error connecting to MongoDB:\n${error}`)
    }
  }
}
export default connectToMongoDB