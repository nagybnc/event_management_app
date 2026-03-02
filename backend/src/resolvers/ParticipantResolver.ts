import { Resolver, Mutation, Arg, ID } from "type-graphql";
import { Participant } from "../entities/Participant";
import { Event } from "../entities/Event";
import { AddParticipantInput } from "../inputs/AddParticipantInput";
import { AppDataSource } from "../data-source";

@Resolver()
export class ParticipantResolver {
  private participantRepo = AppDataSource.getRepository(Participant);
  private eventRepo = AppDataSource.getRepository(Event);

  @Mutation(() => Participant)
  async addParticipant(
    @Arg("input") input: AddParticipantInput,
  ): Promise<Participant> {
    const event = await this.eventRepo.findOneOrFail({
      where: { id: input.eventId },
    });

    const existing = await this.participantRepo.findOne({
      where: { email: input.email, event: { id: input.eventId } },
    });

    if (existing) {
      throw new Error("This email is already registered for this event");
    }

    const participant = this.participantRepo.create({
      email: input.email,
      event,
    });

    return this.participantRepo.save(participant);
  }

  @Mutation(() => Boolean)
  async removeParticipant(@Arg("id", () => ID) id: string): Promise<boolean> {
    const result = await this.participantRepo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
