const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const bookRoutes = require('./modules/books/bookRoutes');
const libraryRoutes = require('./modules/library/libraryRoutes');
const userRoutes = require('./modules/users/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/health', async (req, res, next) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) { next(error); }
});

app.use('/api/books', bookRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/users', userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await db.initDatabase();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Failed to start:', error);
    process.exit(1);
  });
}

module.exports = { app, start };
