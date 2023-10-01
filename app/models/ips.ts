import mongoose, { Schema } from "mongoose"

const ipSchema = new Schema(
  {
    ip: String,
    count: Number,
  },
  {
    timestamps: true,
  }
)

const Ip = mongoose.models.Ip || mongoose.model("Ip", ipSchema)

export default Ip
