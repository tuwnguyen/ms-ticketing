import { Publisher, Subjects, TicketUpdatedEvent } from "@tuwtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
