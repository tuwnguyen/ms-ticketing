import { OrderCreatedEvent, OrderStatus } from "@tuwtickets/common";
import { Order } from "../../../models/order";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: "sdsdsds",
    userId: "sdsdsd",
    ticket: {
      id: "sdsds",
      price: 10,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("replicas the order info, ack message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = Order.findById(data.id);

  expect(order).toBeDefined();

  expect(msg.ack).toHaveBeenCalled();
});
