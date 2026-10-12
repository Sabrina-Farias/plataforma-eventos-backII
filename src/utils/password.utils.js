import bcrypt from 'bcrypt'

export const createHash = async ( password, salt = 10 ) => {
    return await bcrypt.hash ( password, salt )
}

export const isValidPassword = async ( plain, encrypted ) => {
    return await bcrypt.compare ( plain, encrypted )
}