const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const campaignsRouter = require('./routes/campaigns');
const tasksRouter = require('./routes/tasks');
const teamRouter = require('./routes/team');

app.use('/api/campaigns', campaignsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/team', teamRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 Agency PM API running on http://localhost:${PORT}`);
});
