import { UserModel } from "../models/User.js"

export const getUserByEmail = async email => {
    return await UserModel.findOne({ email })
}