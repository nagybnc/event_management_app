import "dotenv/config";
import { Worker } from "bullmq";
import { sendEventPublishedEmail } from "../utils/mailer";

interface EmailJobData {
  eventId: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  emails: string[];
}

const worker = new Worker<EmailJobData>(
  "email-notifications",
  async (job) => {
    const { eventTitle, startDate, endDate, location, emails } = job.data;
    console.log(
      `Processing email job for event "${eventTitle}" — ${emails.length} recipient(s)`,
    );

    for (const email of emails) {
      await sendEventPublishedEmail(
        email,
        eventTitle,
        startDate,
        endDate,
        location,
      );
      console.log(`  Sent to ${email}`);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || 6379),
    },
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

console.log("Email worker started");
