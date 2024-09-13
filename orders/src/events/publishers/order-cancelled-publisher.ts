import { Subjects, OrderCancelledEvent, Publisher } from "@tuwtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
