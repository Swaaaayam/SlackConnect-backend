import { Request, Response } from 'express';
import { getValidAccessTokenForTeam, callSlackApi } from '../services/slackService';
import db from '../models/db';

export async function sendNow(req: Request, res: Response) {
  const { team_id, channel, text } = req.body;
  const token = await getValidAccessTokenForTeam(team_id);
  const r = await callSlackApi(token, 'chat.postMessage', { channel, text });
  res.json(r);
}

export async function scheduleMessage(req: Request, res: Response) {
  const { team_id, channel, text, post_at } = req.body;
  const token = await getValidAccessTokenForTeam(team_id);
  const postAtSeconds = Math.floor(new Date(post_at).getTime() / 1000);
  const r = await callSlackApi(token, 'chat.scheduleMessage', { channel, text, post_at: String(postAtSeconds) });
  db.prepare(`INSERT INTO scheduled_messages (team_id, channel_id, text, post_at, slack_scheduled_message_id) VALUES (?,?,?,?,?)`)
    .run(team_id, channel, text, postAtSeconds, r.scheduled_message_id || null);
  res.json(r);
}

export function listScheduled(req: Request, res: Response) {
  const { team_id } = req.query;
  const rows = db.prepare('SELECT * FROM scheduled_messages WHERE team_id = ? AND status = "scheduled"').all(team_id);
  res.json(rows);
}

export async function cancelScheduled(req: Request, res: Response) {
  const id = req.params.id;
  const row = db.prepare('SELECT * FROM scheduled_messages WHERE id = ?').get(id);
  if (!row) return res.status(404).json({error:'not found'});
  const token = await getValidAccessTokenForTeam(row.team_id);
  await callSlackApi(token, 'chat.deleteScheduledMessage', { channel: row.channel_id, scheduled_message_id: row.slack_scheduled_message_id });
  db.prepare('UPDATE scheduled_messages SET status = "cancelled" WHERE id = ?').run(id);
  res.json({ok:true});
}
