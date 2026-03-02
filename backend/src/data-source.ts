import { DataSource } from "typeorm";
import { Event } from "./entities/Event";
import { Participant } from "./entities/Participant";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "events",
  synchronize: true,
  entities: [Event, Participant],
});
