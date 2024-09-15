import { OrderCancelledEvent, OrderStatus } from "@tuwtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledlistener } from "../order-canceled-listener";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledlistener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: "sdsdsd",
    price: 10,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "sdsd",
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status or the order, acks, the message", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
