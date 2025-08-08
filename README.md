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


Setup Instructions
Install dependencies:

npm install

Create and configure your .env file:

Go to https://api.slack.com/apps.

Create a new app and set the OAuth & Permissions Redirect URL to your local backend URL (e.g., http://localhost:4000/auth/callback).

In Your App > OAuth & Permissions > Scopes, add channels:read and chat:write.public.

Copy your Client ID and Client Secret.

Create a .env file in the root of this directory with the following content:

PORT=4000
SLACK_CLIENT_ID=your_client_id_here
SLACK_CLIENT_SECRET=your_client_secret_here
SLACK_REDIRECT_URI=http://localhost:4000/auth/callback
FRONTEND_URL=http://localhost:5173
DB_PATH=./data/sqlite.db

Start the server:

npm run dev

Architectural Overview


The backend uses a clear separation of concerns:

app.ts: The main Express application file that defines all routes.

authController.ts: Handles the OAuth 2.0 authorization process.

messageController.ts: Manages all message-related API endpoints.

slackService.ts: A service layer that encapsulates all direct calls to the Slack API, including the critical access token refresh logic.

db.ts: Manages the connection to the SQLite database.

A background process runs every minute to check for and send scheduled messages.

Challenges & Learnings 

OAuth 2.0 Flow: Successfully implementing the OAuth 2.0 flow, especially handling the redirect and token exchange, was a key challenge.

Token Management: The automatic refresh token logic was critical to ensuring the application could maintain a connection to Slack without user re-authentication.

Full-Stack Integration: Aligning the frontend API calls with the backend's routes and data models required careful coordination to ensure a seamless flow of information.

Environment Variable Management: A significant challenge was ensuring that the .env variables were correctly loaded and accessed across different parts of the application, especially with the TypeScript transpilation process.
