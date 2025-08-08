# SlackConnect-backend
This is the backend service for the Slack Connect application. It handles the OAuth 2.0 flow, token management, and all communication with the Slack API for sending and scheduling messages.

Technology Stack
Platform: Node.js, Express.js

Language: TypeScript

Persistence: SQLite via better-sqlite3

Dependencies: axios, cors, dotenv, ts-node-dev, uuid

API Endpoints
GET /auth/install: Initiates the Slack OAuth 2.0 flow.

GET /auth/callback: Handles the redirect from Slack after successful authorization.

GET /api/channels: Fetches a list of public and private channels from the connected Slack workspace.

POST /api/message/send: Sends a message to a specified channel immediately.

POST /api/message/schedule: Schedules a message to be sent at a future date and time.

GET /api/message/scheduled: Retrieves a list of all currently scheduled messages.

DELETE /api/message/scheduled/:id: Cancels a scheduled message by its ID.
