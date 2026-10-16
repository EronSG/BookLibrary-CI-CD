const users = require('./userModel');

async function listUsers(req, res, next) {
  try { res.json(await users.getAllUsers()); } catch (error) { next(error); }
}

async function createUser(req, res, next) {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    res.status(201).json(await users.createUser({ name, email }));
  } catch (error) { next(error); }
}

async function deleteUser(req, res, next) {
  try {
    const deleted = await users.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) { next(error); }
}

async function createLoan(req, res, next) {
  try {
    const { user_id, book_id } = req.body;
    if (!user_id || !book_id) return res.status(400).json({ error: 'user_id and book_id are required' });
    res.status(201).json(await users.createLoan({ user_id, book_id }));
  } catch (error) { next(error); }
}

async function listLoans(req, res, next) {
  try { res.json(await users.getLoans()); } catch (error) { next(error); }
}

async function returnLoan(req, res, next) {
  try {
    const loan = await users.returnLoan(req.params.id);
    if (!loan) return res.status(404).json({ error: 'Active loan not found' });
    res.json(loan);
  } catch (error) { next(error); }
}

module.exports = { listUsers, createUser, deleteUser, createLoan, listLoans, returnLoan };
