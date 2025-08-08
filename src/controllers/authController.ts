import { Request, Response } from 'express';
import { SLACK_CLIENT_ID, SLACK_REDIRECT_URI, FRONTEND_URL } from '../config';
import { exchangeCode } from '../services/slackService';
import db from '../models/db';

export function install(req: Request, res: Response) {
  const scopes = [
    'chat:write',
    'channels:read',
    'chat:write.public'
  ].join(',');

  const url = `https://slack.com/oauth/v2/authorize?client_id=${SLACK_CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(SLACK_REDIRECT_URI)}`;
  res.redirect(url);
}

export async function callback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send('Missing code');
    }

    const data = await exchangeCode(code);

    const teamId = data.team?.id || data.team_id;
    const access = data.access_token;
    const refresh = data.refresh_token || null;
    const expiresIn = data.expires_in || 3600;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    db.prepare(`
      INSERT OR REPLACE INTO workspaces (team_id, access_token, refresh_token, token_expires_at)
      VALUES (?, ?, ?, ?)
    `).run(teamId, access, refresh, expiresAt);

    res.redirect(`${FRONTEND_URL}/?team_id=${teamId}`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('OAuth failed');
  }
}
