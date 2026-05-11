const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/team — members with active task counts and task list
router.get('/', (req, res) => {
  try {
    const members = db.prepare('SELECT * FROM team').all();
    const result = members.map(member => {
      const tasks = db.prepare(`
        SELECT t.id, t.title, t.status, t.priority, t.dueDate, t.campaignId,
               c.title as campaignTitle
        FROM tasks t
        JOIN campaigns c ON c.id = t.campaignId
        WHERE t.assignee = ? AND t.status != 'Done'
        ORDER BY t.dueDate ASC
      `).all(member.name);

      return { ...member, taskCount: tasks.length, tasks };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
