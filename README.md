# Event Management App

This repository contains a small full-stack event management app.

- clear domain model
- working GraphQL API
- async email notifications via queue worker
- simple React + MUI frontend

It is **not positioned as production-ready**.

## Tech Stack

- Backend: Node.js, TypeScript, Express, Apollo Server, TypeGraphQL, TypeORM, PostgreSQL
- Async notifications: BullMQ + Redis + Nodemailer
- Email preview/testing: Mailpit
- Frontend: Vite, React, Apollo Client, MUI

## Features Implemented

- Event CRUD (`DRAFT` / `PUBLISHED`)
- Event location selection from a fixed enum list
- Event date validation (`startDate < endDate`)
- Business rule: no overlapping `PUBLISHED` events at the same location
- Participant add/remove by email
- Unique participant email per event
- Publish flow: `DRAFT -> PUBLISHED` enqueues email notification job
- Worker sends emails asynchronously through Mailpit SMTP

## Run Locally

1. Start infrastructure:

```bash
docker compose up -d
```

2. Install dependencies:

```bash
npm install
```

3. Start backend:

```bash
cd backend
npm run dev
```

4. Start worker (new terminal):

```bash
cd backend
npm run worker
```

5. Start frontend (new terminal):

```bash
cd frontend
npm run dev
```

URLs:
- GraphQL API: `http://localhost:4000/graphql`
- Frontend: `http://localhost:3000`
- Mailpit UI: `http://localhost:8025`

## Quick Manual Validation

1. Create a `DRAFT` event.
2. Add one or more participants.
3. Publish the event.
4. Check Mailpit for notification emails.
5. Try creating/publishing an overlapping event at the same location and time range (should fail).

## Tradeoffs (Intentional for Test Scope)

- `TypeORM synchronize: true` is used for speed of delivery.
  - Faster setup for a take-home.
  - Tradeoff: not ideal for production schema lifecycle.

- Error handling is intentionally simple (`throw new Error(...)` from resolvers).
  - Keeps code readable and quick to implement.
  - Tradeoff: no structured error catalog / no centralized mapping layer.

- Frontend data refresh uses `refetchQueries` after mutations.
  - Lower risk and simpler than custom cache updates.
  - Tradeoff: extra network roundtrips.

- No authentication/authorization.
  - Out of task scope.
  - Tradeoff: endpoints are not access-controlled.

- Queue worker uses straightforward sequential email sending per job payload.
  - Easy to understand and debug.
  - Tradeoff: not optimized for high throughput or advanced retry/idempotency workflows.

- Testing is mostly manual + TypeScript/build verification.
  - Matches time budget and task expectations.
  - Tradeoff: limited automated regression safety.

## What I Would Improve with More Time

- Replace `synchronize` with migrations.
- Add integration tests for overlap and publish-notification behavior.
- Introduce structured GraphQL error codes.
- Add pagination/filtering for event list.
- Add authentication and basic audit logging.