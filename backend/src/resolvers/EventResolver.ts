import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Event } from "../entities/Event";
import { EventStatus } from "../enums/EventStatus";
import { CreateEventInput } from "../inputs/CreateEventInput";
import { UpdateEventInput } from "../inputs/UpdateEventInput";
import { AppDataSource } from "../data-source";

@Resolver()
export class EventResolver {
  private eventRepo = AppDataSource.getRepository(Event);

  @Query(() => [Event])
  async events(): Promise<Event[]> {
    return this.eventRepo.find({
      relations: ["participants"],
      order: { startDate: "ASC" },
    });
  }

  @Query(() => Event, { nullable: true })
  async event(@Arg("id", () => ID) id: string): Promise<Event | null> {
    return this.eventRepo.findOne({
      where: { id },
      relations: ["participants"],
    });
  }

  @Mutation(() => Event)
  async createEvent(@Arg("input") input: CreateEventInput): Promise<Event> {
    this.validateDates(input.startDate, input.endDate);

    const status = input.status ?? EventStatus.DRAFT;

    if (status === EventStatus.PUBLISHED) {
      await this.checkOverlap(
        input.location,
        input.startDate,
        input.endDate,
        null,
      );
    }

    const event = this.eventRepo.create({
      ...input,
      status,
      participants: [],
    });
    return this.eventRepo.save(event);
  }

  @Mutation(() => Event)
  async updateEvent(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: UpdateEventInput,
  ): Promise<Event> {
    const event = await this.eventRepo.findOneOrFail({
      where: { id },
      relations: ["participants"],
    });

    const previousStatus = event.status;

    const merged = {
      ...event,
      ...Object.fromEntries(
        Object.entries(input).filter(([, v]) => v !== undefined),
      ),
    };

    this.validateDates(merged.startDate, merged.endDate);

    const newStatus = merged.status as EventStatus;
    if (newStatus === EventStatus.PUBLISHED) {
      await this.checkOverlap(
        merged.location,
        merged.startDate,
        merged.endDate,
        id,
      );
    }

    Object.assign(event, input);
    const saved = await this.eventRepo.save(event);

    return saved;
  }

  @Mutation(() => Boolean)
  async deleteEvent(@Arg("id", () => ID) id: string): Promise<boolean> {
    const result = await this.eventRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private validateDates(startDate: Date, endDate: Date): void {
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("Start date must be before end date");
    }
  }

  private async checkOverlap(
    location: string,
    startDate: Date,
    endDate: Date,
    excludeId: string | null,
  ): Promise<void> {
    const qb = this.eventRepo
      .createQueryBuilder("e")
      .where("e.location = :location", { location })
      .andWhere("e.status = :status", { status: EventStatus.PUBLISHED })
      .andWhere("e.startDate < :endDate", { endDate })
      .andWhere("e.endDate > :startDate", { startDate });

    if (excludeId) {
      qb.andWhere("e.id != :excludeId", { excludeId });
    }

    const overlap = await qb.getOne();
    if (overlap) {
      throw new Error(
        `Overlapping PUBLISHED event "${overlap.title}" exists at this location`,
      );
    }
  }
}
