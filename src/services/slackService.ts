import axios from 'axios';
import db from '../models/db';
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } from '../config';

async function exchangeCode(code: string) {
  const params = new URLSearchParams({
    code, client_id: SLACK_CLIENT_ID, client_secret: SLACK_CLIENT_SECRET, redirect_uri: SLACK_REDIRECT_URI
  });
  const res = await axios.post('https://slack.com/api/oauth.v2.access', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  if (!res.data.ok) throw new Error(JSON.stringify(res.data));
  return res.data; // contains access_token, refresh_token (if token rotation enabled), team
}

async function refreshAccessToken(refreshToken: string) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SLACK_CLIENT_ID,
    client_secret: SLACK_CLIENT_SECRET
  });
  const res = await axios.post('https://slack.com/api/oauth.v2.access', params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  if (!res.data.ok) throw new Error(JSON.stringify(res.data));
  return res.data;
}

async function callSlackApi(token: string, path: string, form?: any) {
  const url = `https://slack.com/api/${path}`;
  if (form) {
    return axios.post(url, new URLSearchParams(form).toString(), {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(r => r.data);
  }
  return axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data);
}

// helper to get token from DB and refresh if needed
async function getValidAccessTokenForTeam(teamId: string) {
  const row = db.prepare('SELECT access_token, refresh_token, token_expires_at FROM workspaces WHERE team_id = ?').get(teamId);
  if (!row) throw new Error('workspace not installed');
  const now = Math.floor(Date.now() / 1000);
  if (row.token_expires_at && row.token_expires_at < now + 30) {
    // refresh
    const r = await refreshAccessToken(row.refresh_token);
    const access = r.access_token;
    const refresh = r.refresh_token || row.refresh_token;
    const expiresAt = now + (r.expires_in || 3600);
    db.prepare('UPDATE workspaces SET access_token=?, refresh_token=?, token_expires_at=? WHERE team_id=?')
      .run(access, refresh, expiresAt, teamId);
    return access;
  }
  return row.access_token;
}

export { exchangeCode, getValidAccessTokenForTeam, callSlackApi };
