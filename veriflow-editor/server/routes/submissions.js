import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

function calculateIntegrity(logs, contentLength) {
  if (!Array.isArray(logs) || logs.length === 0) {
    return { score: 100, flags: [], stats: { pastedChars: 0, aiChars: 0, totalVolume: Number(contentLength) || 0 } };
  }
  const pasteEvents = logs.filter(l => l.type === 'paste');
  const aiEvents = logs.filter(l => l.type === 'ai_insert');
  const inputEvents = logs.filter(l => l.type === 'input');
  const pastedChars = pasteEvents.reduce((acc, curr) => acc + (Number(curr.pastedLength) || 0), 0);
  const aiChars = aiEvents.reduce((acc, curr) => acc + (Number(curr.responseLength) || 0), 0);
  const bursts = inputEvents.filter(l => (Number(l.change) || 0) > 50);
  const suspiciousJumps = bursts.length;
  const totalVolume = Math.max(Number(contentLength) || 0, 1);
  let score = 100;
  let flags = [];
  const pasteRatio = pastedChars / totalVolume;
  if (pasteRatio > 0) {
    score -= Math.min(Math.floor(pasteRatio * 100), 100);
    if (pasteRatio > 0.05) flags.push(`Significant Pasting (${Math.floor(pasteRatio * 100)}% of text)`);
  }
  const aiRatio = aiChars / totalVolume;
  if (aiRatio > 0) {
    score -= Math.min(Math.floor(aiRatio * 25), 25);
    flags.push(`AI Assistance Used (${Math.floor(aiRatio * 100)}% of text)`);
  }
  if (suspiciousJumps > 0) {
    score -= (suspiciousJumps * 15);
    flags.push(`${suspiciousJumps} Suspicious Typing Bursts Detected`);
  }
  let lastSuspiciousTime = 0;
  if (bursts.length > 0) lastSuspiciousTime = Math.max(lastSuspiciousTime, Math.max(...bursts.map(b => b.timestamp || 0)));
  if (pasteEvents.length > 0) lastSuspiciousTime = Math.max(lastSuspiciousTime, Math.max(...pasteEvents.map(p => p.timestamp || 0)));
  if (lastSuspiciousTime > 0) {
    const postSuspiciousInput = inputEvents
      .filter(l => (l.timestamp || 0) > lastSuspiciousTime && (Number(l.change) || 0) <= 50)
      .reduce((acc, curr) => acc + (Number(curr.change) || 0), 0);
    if (postSuspiciousInput > 50) {
      const recoveryPoints = Math.min(Math.floor(postSuspiciousInput / 20), 40);
      score += recoveryPoints;
      flags.push(`Hybrid Pattern: Manual Recovery Detected (+${recoveryPoints} pts)`);
    }
  }
  return { score: Math.min(100, Math.max(0, Math.floor(score))), flags, stats: { pastedChars, aiChars, totalVolume } };
}

router.post('/documents/:id/submit', (req, res) => {
  try {
    const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const logs = JSON.parse(doc.logs);
    const content = doc.content || '';
    const contentLength = content.length;

    const { score, flags, stats } = calculateIntegrity(logs, contentLength);

    const submissionId = uuidv4();
    const submitted_at = new Date().toISOString();

    db.prepare(`
      INSERT INTO submissions (id, document_id, user_id, content, score, flags, stats, submitted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      submissionId, doc.id, req.user.id, content, score, JSON.stringify(flags), JSON.stringify(stats), submitted_at
    );

    const newSubmission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(submissionId);
    newSubmission.flags = JSON.parse(newSubmission.flags);
    newSubmission.stats = JSON.parse(newSubmission.stats);

    res.json(newSubmission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submissions', (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT s.*, d.title as document_title
      FROM submissions s
      JOIN documents d ON s.document_id = d.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
    `).all(req.user.id);

    const mapped = submissions.map(sub => {
      return {
        ...sub,
        flags: JSON.parse(sub.flags),
        stats: JSON.parse(sub.stats)
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submissions/:id', (req, res) => {
  try {
    const submission = db.prepare(`
      SELECT s.*, d.title as document_title
      FROM submissions s
      JOIN documents d ON s.document_id = d.id
      WHERE s.id = ? AND s.user_id = ?
    `).get(req.params.id, req.user.id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    submission.flags = JSON.parse(submission.flags);
    submission.stats = JSON.parse(submission.stats);

    res.json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
