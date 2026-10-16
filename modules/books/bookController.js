const books = require('./bookModel');

async function list(req, res, next) {
  try { res.json(await books.getAll()); } catch (error) { next(error); }
}

async function get(req, res, next) {
  try {
    const book = await books.getById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) { next(error); }
}

async function create(req, res, next) {
  try {
    const { title, author, year } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });
    res.status(201).json(await books.create({ title, author, year }));
  } catch (error) { next(error); }
}

async function update(req, res, next) {
  try {
    const { title, author, year } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Title and author are required' });
    const book = await books.update(req.params.id, { title, author, year });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (error) { next(error); }
}

async function remove(req, res, next) {
  try {
    const deleted = await books.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) { next(error); }
}

module.exports = { list, get, create, update, remove };
