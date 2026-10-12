import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles, authorizeEventOwnerOrAdmin } from "../middlewares/authorize.middleware.js";
import { getEvents, getEventsById, createEvent, updateEvent, cancelEvent } from "../controllers/event.controller.js";

const router = Router();

router.get("/", getEvents )
router.get("/:id", getEventsById )
router.post("/", authMiddleware, authorizeRoles('admin', 'organizer'), createEvent )
router.put("/:id", authMiddleware, authorizeEventOwnerOrAdmin, updateEvent )
router.patch('/:id/cancel', authMiddleware, authorizeEventOwnerOrAdmin, cancelEvent);


export default router