import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: false,
});

export async function sendEventPublishedEmail(
  to: string,
  eventTitle: string,
  startDate: string,
  endDate: string,
  location: string,
): Promise<void> {
  await transporter.sendMail({
    from: '"Event Manager" <events@events.com>',
    to,
    subject: `Event Published: ${eventTitle}`,
    html: `
      <h1>${eventTitle}</h1>
      <p>The event you are registered for has been published!</p>
      <ul>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Start:</strong> ${new Date(startDate).toLocaleString()}</li>
        <li><strong>End:</strong> ${new Date(endDate).toLocaleString()}</li>
      </ul>
    `,
  });
}
