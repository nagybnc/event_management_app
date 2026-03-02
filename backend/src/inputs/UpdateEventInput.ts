import { InputType, Field } from "type-graphql";
import { EventStatus } from "../enums/EventStatus";
import { Location } from "../constants/locations";

@InputType()
export class UpdateEventInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Location, { nullable: true })
  location?: Location;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field(() => EventStatus, { nullable: true })
  status?: EventStatus;
}
