const express = require('express');
const { Pool } = require('pg');
const app = express();
const db = new Pool({
  host: process.env.DB_HOST || 'database',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'library',
  user: process.env.DB_USER || 'libraryuser',
  password: process.env.DB_PASSWORD
});
app.get('/health', async (req, res) => {
  try { await db.query('SELECT 1'); res.json({ status: 'ok', module: 'reports', database: 'connected' }); }
  catch (error) { res.status(503).json({ status: 'error', module: 'reports', database: 'disconnected' }); }
});
app.get('/api/reports/summary', async (req, res) => {
  try {
    const result = await db.query(`SELECT
      (SELECT COUNT(*)::int FROM books) AS total_books,
      (SELECT COUNT(*)::int FROM users) AS total_users,
      (SELECT COUNT(*)::int FROM loans WHERE status = 'borrowed') AS active_loans,
      (SELECT COUNT(*)::int FROM loans WHERE status = 'returned') AS returned_loans`);
    res.json(result.rows[0]);
  } catch (error) { console.error('Report query failed:', error.message); res.status(500).json({ error: 'Unable to generate library summary' }); }
});
app.get('/api/reports/loans-by-status', async (req, res) => {
  try {
    const result = await db.query('SELECT status, COUNT(*)::int AS count FROM loans GROUP BY status ORDER BY status');
    res.json(result.rows);
  } catch (error) { console.error('Report query failed:', error.message); res.status(500).json({ error: 'Unable to generate loan report' }); }
});
const port = Number(process.env.PORT || 3002);
const server = app.listen(port, '0.0.0.0', () => console.log(`Reports service running on ${port}`));
process.on('SIGTERM', async () => { server.close(); await db.end(); });
