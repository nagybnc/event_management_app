import { InputType, Field } from "type-graphql";

@InputType()
export class AddParticipantInput {
  @Field()
  eventId!: string;

  @Field()
  email!: string;
}
