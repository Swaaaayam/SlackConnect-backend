import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID!;
export const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET!;
export const SLACK_REDIRECT_URI = process.env.SLACK_REDIRECT_URI!;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const DB_PATH = process.env.DB_PATH || './data/sqlite.db';
