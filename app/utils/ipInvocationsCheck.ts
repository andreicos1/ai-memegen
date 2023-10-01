import { NextRequest } from "next/server"
import connectMongoDB from "../libs/mongodb"
import Ip from "../models/ips"

const MAX_DAILY_GENERATIONS = 20
const MAX_DAILY_GENERATIONS_WARNING_THRESHOLD = 15
const APPROACHING_LIMIT_CODE = "APPROACHING_LIMIT_CODE"
const HIT_MAX_DAILY_CODE = "HIT_MAX_DAILY_CODE"
const DOT_ENCODING = "%2E"

const encodeIp = (ip: string) => {
  return encodeURIComponent(ip).replace(/\./g, DOT_ENCODING)
}

export const getIp = (request: NextRequest): string => {
  const ipHeader = request.headers.get("x-forwarded-for") || request.headers.get("x-appengine-user-ip")
  const ip = typeof ipHeader === "string" ? ipHeader.split(",")[0] : ipHeader?.[0] || ""
  return encodeIp(ip)
}

const getIpLimitStatus = async (ip: string) => {
  try {
    const ipTrack = await Ip.findOne({ ip })
    if (!ipTrack) return ""

    if (ipTrack.count >= MAX_DAILY_GENERATIONS) return HIT_MAX_DAILY_CODE
    if (ipTrack.count >= MAX_DAILY_GENERATIONS_WARNING_THRESHOLD) return APPROACHING_LIMIT_CODE

    return ""
  } catch (error) {
    console.log(error)
    return ""
  }
}

const saveIp = async (ip: string) => {
  try {
    let ipTrack = await Ip.findOne({ ip })
    if (ipTrack) {
      ipTrack.count += 1
    } else {
      ipTrack = new Ip({ ip, count: 1 })
    }
    await ipTrack.save()
    return false
  } catch (error) {
    console.log("Error in saveIp:", error)
    return true
  }
}

export const checkLimitReached = async (request: NextRequest) => {
  await connectMongoDB()

  const ip = getIp(request)

  if (!ip) {
    // If we can't get the IP, we can't track it. Localhost is an example of this.
    // If someone can spoof their IP, they can bypass the whole check anyway.
    return false
  }

  if (typeof ip !== "string") {
    return true
  }

  const limitStatus = await getIpLimitStatus(ip)

  if (limitStatus === HIT_MAX_DAILY_CODE) {
    return true
  }

  return await saveIp(ip)
}
