import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const db = new Database('./database/crm.db');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Legacy local CRM server retained only for development reference.
// Authentication has intentionally been disabled. Production staff access
// must use the Supabase-backed authentication model before launch.
app.post('/api/login', (_req, res) => {
  res.status(503).json({
    success: false,
    message: 'Legacy CRM authentication is disabled. Secure staff authentication is required.'
  });
});

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Legacy local development server available', timestamp: new Date().toISOString() });
});

app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`Legacy CKW development server running on port ${PORT}`);
});
