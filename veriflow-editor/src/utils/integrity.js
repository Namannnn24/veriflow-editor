export const calculateIntegrity = (logs, contentLength) => {
  if (!Array.isArray(logs) || logs.length === 0) {
    return {
      score: 100,
      flags: [],
      stats: { pastedChars: 0, aiChars: 0, totalVolume: Number(contentLength) || 0 }
    };
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

  // 1. Paste Penalty
  const pasteRatio = pastedChars / totalVolume;
  if (pasteRatio > 0) {
    const penalty = Math.min(Math.floor(pasteRatio * 100), 100);
    score -= penalty;
    if (pasteRatio > 0.05) flags.push(`Significant Pasting (${Math.floor(pasteRatio * 100)}% of text)`);
  }

  // 2. AI Penalty
  const aiRatio = aiChars / totalVolume;
  if (aiRatio > 0) {
    const penalty = Math.min(Math.floor(aiRatio * 25), 25);
    score -= penalty;
    flags.push(`AI Assistance Used (${Math.floor(aiRatio * 100)}% of text)`);
  }

  // 3. Burst Penalty
  if (suspiciousJumps > 0) {
    score -= (suspiciousJumps * 15);
    flags.push(`${suspiciousJumps} Suspicious Typing Bursts Detected`);
  }

  // 4. Hybrid Recovery Logic
  let lastSuspiciousTime = 0;

  if (bursts.length > 0) {
    const maxBurst = Math.max(...bursts.map(b => b.timestamp || 0));
    lastSuspiciousTime = Math.max(lastSuspiciousTime, maxBurst);
  }
  if (pasteEvents.length > 0) {
    const maxPaste = Math.max(...pasteEvents.map(p => p.timestamp || 0));
    lastSuspiciousTime = Math.max(lastSuspiciousTime, maxPaste);
  }

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

  return {
    score: Math.min(100, Math.max(0, Math.floor(score))),
    flags,
    stats: { pastedChars, aiChars, totalVolume }
  };
};

export const getScoreColor = (score) => {
  if (score > 85) return 'text-emerald-500';
  if (score > 60) return 'text-amber-500';
  return 'text-rose-500';
};

export const getScoreLabel = (score) => {
  if (score > 85) return 'Verified';
  if (score > 60) return 'Mixed';
  return 'Flagged';
};

export const getScoreBgColor = (score) => {
  if (score > 85) return 'bg-emerald-100';
  if (score > 60) return 'bg-amber-100';
  return 'bg-rose-100';
};
