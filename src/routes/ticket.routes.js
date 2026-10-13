import { Router } from "express";
<<<<<<< HEAD
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
=======
import { createTicket, getMyTickets, cancelTicket } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", authMiddleware, createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.put("/:tid/cancel", authMiddleware, cancelTicket);
>>>>>>> pre-entrega-7-correcciones

export default router;
