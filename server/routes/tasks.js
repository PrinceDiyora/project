const express = require('express');
const router = express.Router();
const db = require('../data/db');

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  try {
    const { title, assignee, dueDate, priority, status, description } = req.body;
    db.prepare(
      `UPDATE tasks SET title=?, assignee=?, dueDate=?, priority=?, status=?, description=?
       WHERE id=?`
    ).run(title, assignee, dueDate, priority, status, description, req.params.id);
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
