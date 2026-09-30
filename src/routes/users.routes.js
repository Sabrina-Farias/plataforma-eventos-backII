import { Router } from "express";

import { createUsers, getUsers } from "../controllers/users.controller.js";

const router = Router()

router.get('/', getUsers )
router.post('/', createUsers )

export default router
