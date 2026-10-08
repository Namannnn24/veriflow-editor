import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/', (req, res) => {
  try {
    const documents = db.prepare('SELECT id, title, content, created_at, updated_at FROM documents WHERE user_id = ? ORDER BY updated_at DESC').all(req.user.id);
    
    const mapped = documents.map(doc => {
      const content = doc.content || '';
      return {
        id: doc.id,
        title: doc.title,
        content: content.substring(0, 200),
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        wordCount: content.trim() ? content.trim().split(/\s+/).length : 0,
        charCount: content.length
      };
    });
    
    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', (req, res) => {
  try {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare('INSERT INTO documents (id, user_id, title, content, logs, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(id, req.user.id, 'Untitled Draft', '', '[]', now, now);
      
    const newDoc = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
    newDoc.logs = JSON.parse(newDoc.logs);
    
    res.json(newDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    doc.logs = JSON.parse(doc.logs);
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { title, content, newLogs } = req.body;
    
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const now = new Date().toISOString();
    let updatedTitle = title !== undefined ? title : doc.title;
    let updatedContent = content !== undefined ? content : doc.content;
    let updatedLogsStr = doc.logs;
    
    if (Array.isArray(newLogs) && newLogs.length > 0) {
      const existingLogs = JSON.parse(doc.logs);
      const combinedLogs = existingLogs.concat(newLogs);
      updatedLogsStr = JSON.stringify(combinedLogs);
    }
    
    db.prepare('UPDATE documents SET title = ?, content = ?, logs = ?, updated_at = ? WHERE id = ?')
      .run(updatedTitle, updatedContent, updatedLogsStr, now, doc.id);
      
    res.json({ success: true, updated_at: now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Document not found or not authorized' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
