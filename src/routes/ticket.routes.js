import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    purchaseTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from "../controllers/ticket.controller.js";

const router = Router();

// Rutas directas de tickets
router.get("/my-tickets", authMiddleware, getMyTickets);
router.patch("/:ticketId/cancel", authMiddleware, cancelTicket);

// Rutas asociadas al evento
router.post("/events/:eventId", authMiddleware, purchaseTicket);
router.get("/events/:eventId", authMiddleware, getEventTickets);

export default router;
