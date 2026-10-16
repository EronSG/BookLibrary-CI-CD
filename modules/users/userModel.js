const db = require('../../config/database');

async function getAllUsers() {
  const result = await db.query('SELECT id, name, email FROM users ORDER BY id DESC');
  return result.rows;
}

async function createUser({ name, email }) {
  const result = await db.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [name, email]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rowCount > 0;
}

async function createLoan({ user_id, book_id }) {
  const result = await db.query(
    `INSERT INTO loans (user_id, book_id)
     VALUES ($1, $2)
     RETURNING id, user_id, book_id, borrow_date, return_date, status`,
    [user_id, book_id]
  );
  return result.rows[0];
}

async function getLoans() {
  const result = await db.query(`
    SELECT l.id, l.user_id, u.name AS user_name,
           l.book_id, b.title AS book_title,
           l.borrow_date, l.return_date, l.status
    FROM loans l
    JOIN users u ON u.id = l.user_id
    JOIN books b ON b.id = l.book_id
    ORDER BY l.id DESC
  `);
  return result.rows;
}

async function returnLoan(id) {
  const result = await db.query(
    `UPDATE loans
     SET status = 'returned', return_date = CURRENT_DATE
     WHERE id = $1 AND status = 'borrowed'
     RETURNING id, user_id, book_id, borrow_date, return_date, status`,
    [id]
  );
  return result.rows[0];
}

module.exports = { getAllUsers, createUser, deleteUser, createLoan, getLoans, returnLoan };
