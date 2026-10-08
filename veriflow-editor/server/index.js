import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import documentRoutes from './routes/documents.js';
import submissionRoutes from './routes/submissions.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initDB();

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api', submissionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
