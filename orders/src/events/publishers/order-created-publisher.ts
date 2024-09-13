import { Publisher, OrderCreatedEvent, Subjects } from "@tuwtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
