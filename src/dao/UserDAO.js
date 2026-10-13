import { UserModel } from "../models/User.js";

export class UserDAO {
    async create(userData) {
        return await UserModel.create(userData);
    }

    async findById(userId) {
        return await UserModel.findById(userId);
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async findAll() {
        return await UserModel.find().select("-password");
    }
}

export const userDAO = new UserDAO();
