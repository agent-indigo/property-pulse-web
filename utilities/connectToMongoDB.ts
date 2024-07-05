import {connect, Mongoose, MongooseOptions, set} from 'mongoose'
const connectToMongoDB: Function = async (): Promise<void> => {
  let connected: boolean = false as boolean
  set('strictQuery' as keyof MongooseOptions, true as boolean)
  if (connected as boolean) {
    console.log('MongoDB already connected.' as string) as void
  } else {
    try {
      const connection: Mongoose = await connect(process.env.MONGODB_URI ?? '' as string) as Mongoose
      connected = true as boolean
      console.log(`MongoDB connection successful:\n${connection.connection.host as string}` as string) as void
    } catch (error: unknown) {
      console.error(`Error connecting to MongoDB:\n${error as string}` as string) as void
    }
  }
}
export default connectToMongoDB as Function