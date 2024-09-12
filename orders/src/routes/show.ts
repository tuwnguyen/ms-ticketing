import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@tuwtickets/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order) throw new NotFoundError();
    if (req.currentUser!.id !== order.userId) throw new NotAuthorizedError();

    res.status(200).send(order);
  }
);

export { router as showOrderRouter };
