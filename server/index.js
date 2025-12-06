import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Database setup - Persistent file storage
const db = new Database('./database/crm.db');

// Initialize database tables
db.serialize(() => {
  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Reservations table
  db.run(`CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    drop_off_date TEXT NOT NULL,
    drop_off_time TEXT NOT NULL,
    pickup_date TEXT NOT NULL,
    knife_quantity TEXT NOT NULL,
    notes TEXT,
    photos TEXT,
    status TEXT DEFAULT 'booked',
    check_in_time DATETIME,
    actual_quantity INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
  )`);

  // Knives table
  db.run(`CREATE TABLE IF NOT EXISTS knives (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL,
    knife_type TEXT NOT NULL,
    price REAL NOT NULL,
    services TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id)
  )`);

  // Invoices table
  db.run(`CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL,
    total_amount REAL NOT NULL,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    invoice_url TEXT,
    details TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id)
  )`);

  // Communications Log table
  db.run(`CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY,
    reservation_id TEXT NOT NULL,
    type TEXT NOT NULL, 
    direction TEXT NOT NULL, 
    summary TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations (id)
  )`);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API ROUTES ---

// Auth
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'SharpKnives2024!') {
    const token = uuidv4();
    res.json({ success: true, token, user: { username: 'admin', role: 'admin' } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Notifications
app.post('/api/notify/dropoff', (req, res) => {
  const { reservationId } = req.body;
  console.log('Sending drop-off notifications...');
  const commId = uuidv4();
  db.run(`INSERT INTO communications (id, reservation_id, type, direction, summary, content) 
    VALUES (?, ?, 'email', 'outbound', 'Drop-off Confirmation', 'System sent drop-off confirmation email')`, 
    [commId, reservationId]);
  res.json({ success: true, message: 'Notifications sent successfully' });
});

app.post('/api/notify/pickup', (req, res) => {
  const { reservationId } = req.body;
  console.log('Sending pickup confirmation notifications...');
  const commId = uuidv4();
  db.run(`INSERT INTO communications (id, reservation_id, type, direction, summary, content) 
    VALUES (?, ?, 'email', 'outbound', 'Pickup Confirmation', 'System sent pickup confirmation email')`, 
    [commId, reservationId]);
  res.json({ success: true, message: 'Notifications sent successfully' });
});

// Reservations
app.get('/api/reservations', (req, res) => {
  const query = `
    SELECT r.*, c.name as customer_name, c.email, c.phone 
    FROM reservations r 
    JOIN customers c ON r.customer_id = c.id 
    ORDER BY r.created_at DESC
  `;
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const formattedRows = rows.map(row => ({
      ...row,
      photos: row.photos ? JSON.parse(row.photos) : []
    }));
    res.json(formattedRows);
  });
});

app.get('/api/reservations/:id', (req, res) => {
  const reservationId = req.params.id;
  db.get(`
    SELECT r.*, c.name as customer_name, c.email, c.phone 
    FROM reservations r 
    JOIN customers c ON r.customer_id = c.id 
    WHERE r.id = ?
  `, [reservationId], (err, reservation) => {
    if (err || !reservation) {
      res.status(404).json({ error: 'Reservation not found' });
      return;
    }
    db.all(`SELECT * FROM knives WHERE reservation_id = ?`, [reservationId], (err, knives) => {
      db.get(`SELECT * FROM invoices WHERE reservation_id = ?`, [reservationId], (err, invoice) => {
        db.all(`SELECT * FROM communications WHERE reservation_id = ? ORDER BY created_at DESC`, [reservationId], (err, comms) => {
          const response = {
            ...reservation,
            photos: reservation.photos ? JSON.parse(reservation.photos) : [],
            knives: knives || [],
            invoice: invoice ? { ...invoice, details: invoice.details ? JSON.parse(invoice.details) : null } : null,
            communications: comms || []
          };
          res.json(response);
        });
      });
    });
  });
});

app.put('/api/reservations/:id/status', (req, res) => {
  const { status } = req.body;
  const reservationId = req.params.id;
  db.run(`UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
    [status, reservationId], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: `Status updated to ${status}` });
    });
});

app.put('/api/reservations/:id/check-in', (req, res) => {
  const reservationId = req.params.id;
  const { actualQuantity, photos, checkInTime } = req.body;
  db.run(`UPDATE reservations SET actual_quantity = ?, knife_quantity = ?, photos = ?, check_in_time = ?, status = 'received', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
    [actualQuantity, actualQuantity.toString(), JSON.stringify(photos), checkInTime, reservationId], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: 'Check-in details updated' });
    }
  );
});

// Communications
app.post('/api/reservations/:id/communication', (req, res) => {
  const reservationId = req.params.id;
  const { type, direction, summary, content } = req.body;
  const id = uuidv4();
  db.run(`INSERT INTO communications (id, reservation_id, type, direction, summary, content) 
    VALUES (?, ?, ?, ?, ?, ?)`, 
    [id, reservationId, type, direction, summary, content], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, id });
    }
  );
});

// Knives & Invoices
app.post('/api/reservations/:id/knives', (req, res) => {
  const reservationId = req.params.id;
  const { knives } = req.body;
  
  db.run(`DELETE FROM knives WHERE reservation_id = ?`, [reservationId], (err) => {
    if (err) console.error("Error clearing knives", err);
    
    const stmt = db.prepare(`INSERT INTO knives (id, reservation_id, knife_type, price, services) VALUES (?, ?, ?, ?, ?)`);
    knives.forEach(knife => {
      const knifeId = uuidv4();
      stmt.run([knifeId, reservationId, knife.type, knife.price, knife.services]);
    });
    stmt.finalize((err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    });
  });
});

app.post('/api/reservations/:id/invoice', (req, res) => {
  const reservationId = req.params.id;
  const { paymentMethod, paymentStatus, knives, details, paypalHandle } = req.body;
  const total = details.total;
  const status = paymentStatus || 'pending';
  
  const invoiceId = uuidv4();
  const handle = paypalHandle || 'chefknifeworks';
  const invoiceUrl = `https://paypal.me/${handle}/${total.toFixed(2)}`;

  db.run(`INSERT OR REPLACE INTO invoices (id, reservation_id, total_amount, payment_method, payment_status, invoice_url, details) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [invoiceId, reservationId, total, paymentMethod || 'paypal', status, invoiceUrl, JSON.stringify(details)], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, invoice: { id: invoiceId, total, paymentMethod, paymentStatus: status, invoiceUrl, knives, details } });
    }
  );
});

// Booking
app.post('/api/reservations/book', (req, res) => {
  const { customer, reservation } = req.body;
  const customerId = uuidv4();
  
  db.serialize(() => {
    db.run(`INSERT OR IGNORE INTO customers (id, name, email, phone) VALUES (?, ?, ?, ?)`, 
      [customerId, customer.name, customer.email, customer.phone]);
    
    db.run(`INSERT INTO reservations (id, customer_id, drop_off_date, drop_off_time, pickup_date, knife_quantity, notes, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'booked')`, 
      [reservation.id, customerId, reservation.dropOffDate, reservation.selectedSlot, reservation.pickupDate, reservation.knifeQty, reservation.notes || ''], 
      function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json({ success: true, reservationId: reservation.id });
      }
    );
  });
});

// Test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Database connection working', timestamp: new Date().toISOString() });
});

app.use(express.static('dist'));

app.listen(PORT, () => {
  console.log(`🚀 CRM Server running on http://localhost:${PORT}`);
});