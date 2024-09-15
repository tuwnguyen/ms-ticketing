import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@tuwtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
