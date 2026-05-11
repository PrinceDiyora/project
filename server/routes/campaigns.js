const express = require('express');
const router = express.Router();
const db = require('../data/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/campaigns
router.get('/', (req, res) => {
  try {
    const campaigns = db.prepare('SELECT * FROM campaigns ORDER BY deadline ASC').all();
    res.json(campaigns.map(c => ({ ...c, tags: JSON.parse(c.tags) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/campaigns
router.post('/', (req, res) => {
  try {
    const { title, clientName, owner, status, deadline, progress, tags } = req.body;
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    db.prepare(
      `INSERT INTO campaigns (id, title, clientName, owner, status, deadline, progress, tags, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, clientName, owner, status || 'Planning', deadline, progress || 0, JSON.stringify(tags || []), createdAt);
    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(id);
    res.status(201).json({ ...campaign, tags: JSON.parse(campaign.tags) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/campaigns/:id
router.put('/:id', (req, res) => {
  try {
    const { title, clientName, owner, status, deadline, progress, tags } = req.body;
    db.prepare(
      `UPDATE campaigns SET title=?, clientName=?, owner=?, status=?, deadline=?, progress=?, tags=?
       WHERE id=?`
    ).run(title, clientName, owner, status, deadline, progress, JSON.stringify(tags || []), req.params.id);
    const campaign = db.prepare('SELECT * FROM campaigns WHERE id = ?').get(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ ...campaign, tags: JSON.parse(campaign.tags) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/campaigns/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM campaigns WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/campaigns/:id/tasks
router.get('/:id/tasks', (req, res) => {
  try {
    const tasks = db.prepare('SELECT * FROM tasks WHERE campaignId = ? ORDER BY dueDate ASC').all(req.params.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/campaigns/:id/tasks
router.post('/:id/tasks', (req, res) => {
  try {
    const { title, assignee, dueDate, priority, status, description } = req.body;
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    db.prepare(
      `INSERT INTO tasks (id, campaignId, title, assignee, dueDate, priority, status, description, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, req.params.id, title, assignee, dueDate, priority || 'Medium', status || 'Todo', description || '', createdAt);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
