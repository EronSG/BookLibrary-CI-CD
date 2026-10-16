const db = require('../../config/database');

async function getAll() {
  const result = await db.query('SELECT id, title, author, year FROM books ORDER BY id DESC');
  return result.rows;
}

async function getById(id) {
  const result = await db.query('SELECT id, title, author, year FROM books WHERE id = $1', [id]);
  return result.rows[0];
}

async function create({ title, author, year }) {
  const result = await db.query(
    'INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING id, title, author, year',
    [title, author, year || null]
  );
  return result.rows[0];
}

async function update(id, { title, author, year }) {
  const result = await db.query(
    'UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING id, title, author, year',
    [title, author, year || null, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

module.exports = { getAll, getById, create, update, remove };
