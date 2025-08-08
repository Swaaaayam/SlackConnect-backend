import express from 'express';
import cors from 'cors';
import { PORT, FRONTEND_URL } from './config';
import * as authCtrl from './controllers/authController';
import * as msgCtrl from './controllers/messageController';


const app = express();
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

app.get('/auth/install', authCtrl.install);
app.get('/auth/callback', authCtrl.callback);

app.post('/api/message/send', msgCtrl.sendNow);
app.post('/api/message/schedule', msgCtrl.scheduleMessage);
app.get('/api/message/scheduled', msgCtrl.listScheduled);
app.delete('/api/message/scheduled/:id', msgCtrl.cancelScheduled);

app.get('/api/channels', async (req, res) => {
  try {
    const team_id = req.query.team_id as string;
    const token = await (await import('./services/slackService')).getValidAccessTokenForTeam(team_id);
    const r = await (await import('./services/slackService')).callSlackApi(token, 'conversations.list');
    res.json(r);
  } catch (err) {
    console.error('Error fetching channels:', err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});


app.listen(PORT, () => console.log(`Server listening ${PORT}`));
