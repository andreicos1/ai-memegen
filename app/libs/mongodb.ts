import mongoose from "mongoose"

const connectMongoDB = async () => {
  try {
    const uri: string = process.env.MONGOOSE_URI!
    console.log({ uri })
    await mongoose.connect(uri)
    console.log("Connected to MongoDB.")
  } catch (error) {
    console.log(error)
  }
}

export default connectMongoDB
