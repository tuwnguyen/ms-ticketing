import { PaymentCreatedEvent, Publisher, Subjects } from "@tuwtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
