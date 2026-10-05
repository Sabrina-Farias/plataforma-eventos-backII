import { verifyToken } from '../utils/jwt.utils.js'

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.currentUser

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            })
        }

        const payload = verifyToken(token);

        req.user = payload;

        next()
    }
    catch {
        return res.status(401).json({
            status: 'error',
            message: 'No autenticado'
        })
    }
}
