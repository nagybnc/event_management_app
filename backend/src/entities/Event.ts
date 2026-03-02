import { ObjectType, Field, ID } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { EventStatus } from "../enums/EventStatus";
import { Location } from "../constants/locations";
import { Participant } from "./Participant";

@ObjectType()
@Entity()
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field(() => EventStatus)
  @Column({ type: "enum", enum: EventStatus, default: EventStatus.DRAFT })
  status!: EventStatus;

  @Field(() => Location)
  @Column({ type: "enum", enum: Location })
  location!: Location;

  @Field()
  @Column({ type: "timestamptz" })
  startDate!: Date;

  @Field()
  @Column({ type: "timestamptz" })
  endDate!: Date;

  @Field(() => [Participant])
  @OneToMany(() => Participant, (p) => p.event, { cascade: true, eager: true })
  participants!: Participant[];

  @Field()
  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
