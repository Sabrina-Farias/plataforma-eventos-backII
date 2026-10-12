import { Router } from "express";
import passport from "passport";
import { register, login, current, logout } from "../controllers/sessions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

const passportCustom = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    status: "error",
                    statusCode: 401,
                    message: info?.message || "No autorizado"
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

router.post('/register', passportCustom('register'), register);
router.post('/login', passportCustom('login'), login);
router.get('/current', authMiddleware, current);
router.post('/logout', logout);

export default router;
