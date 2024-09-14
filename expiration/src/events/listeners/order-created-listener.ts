import { Listener, OrderCreatedEvent, Subjects } from "@tuwtickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage(data: OrderCreatedEvent["data"], msg: Message) {}
}
