import { registerEnumType } from "type-graphql";

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

registerEnumType(EventStatus, {
  name: "EventStatus",
  description: "The status of an event",
});
