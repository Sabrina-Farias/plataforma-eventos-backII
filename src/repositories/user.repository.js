import { userDAO } from "../dao/UserDAO.js";

export class UserRepository {
    async createUser(userData) {
        return await userDAO.create(userData);
    }

    async getUserById(userId) {
        return await userDAO.findById(userId);
    }

    async getUserByEmail(email) {
        return await userDAO.findByEmail(email);
    }

    async getAllUsers() {
        return await userDAO.findAll();
    }
}

export const userRepository = new UserRepository();

export const createUserRepo = (data) => userRepository.createUser(data);
export const getUserByIdRepo = (id) => userRepository.getUserById(id);
export const getUserByEmailRepo = (email) => userRepository.getUserByEmail(email);
export const getAllUsersRepo = () => userRepository.getAllUsers();
