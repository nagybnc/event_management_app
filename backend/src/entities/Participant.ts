import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from "typeorm";
import { Event } from "./Event";

@ObjectType()
@Entity()
@Unique(["email", "event"])
export class Participant {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  email!: string;

  @ManyToOne(() => Event, (event) => event.participants, {
    onDelete: "CASCADE",
  })
  event!: Event;
}