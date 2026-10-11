import { Router } from "express";
import passport from "passport";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles, authorizeEventOwnerOrAdmin } from "../middlewares/authorize.middleware.js";
import { getEvents, getEventsById, createEvent, updateEvent } from "../controllers/event.controller.js";

const router = Router();

router.get("/", getEvents )
router.get("/:eventId", getEventsById )
router.post("/", authMiddleware, authorizeRoles('admin', 'organizer'), createEvent )
router.put("/:eventId", authMiddleware, authorizeRoles('admin', 'organizer'), authorizeEventOwnerOrAdmin, updateEvent )

export default router