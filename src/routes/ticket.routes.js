import { Router } from "express";
import { createTicket, getMyTickets, cancelTicket } from "../controllers/ticket.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", authMiddleware, createTicket);
router.get("/my-tickets", authMiddleware, getMyTickets);
router.put("/:tid/cancel", authMiddleware, cancelTicket);

export default router;
