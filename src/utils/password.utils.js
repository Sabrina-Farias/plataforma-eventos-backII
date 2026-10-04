import bcrypt from 'bcrypt'

export const createHash = async ( password, salt ) => {
    return await bcrypt.hash ( password, salt )
}
