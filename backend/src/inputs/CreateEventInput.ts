import { InputType, Field } from "type-graphql";
import { EventStatus } from "../enums/EventStatus";
import { Location } from "../constants/locations";

@InputType()
export class CreateEventInput {
  @Field()
  title!: string;

  @Field(() => Location)
  location!: Location;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field(() => EventStatus, { nullable: true })
  status?: EventStatus;
}
