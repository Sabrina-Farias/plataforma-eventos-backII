import { Router } from "express";
import passport from "passport";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getUsers } from "../controllers/users.controller.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";


const router = Router()

router.get('/', authMiddleware, authorizeRoles('admin'), getUsers )

export default router
