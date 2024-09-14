import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@tuwtickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "title",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

it("creates and saves the ticket", async () => {
  const { listener, data, message } = await setup();

  // call the onMessage function with the data object + fake message
  await listener.onMessage(data, message);

  // write assertion to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.price).toEqual(data.price);
  expect(ticket?.title).toEqual(data.title);
});

it("acks the message", async () => {
  const { listener, data, message } = await setup();

  // call the onMessage function with the data object + fake message
  await listener.onMessage(data, message);

  // write assertion to make sure ack function was called
  expect(message.ack).toHaveBeenCalled();
});
