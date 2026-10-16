const axios = require('axios');

async function search(req, res, next) {
  try {
    const title = String(req.query.title || '').trim();
    if (!title) return res.status(400).json({ error: 'title query is required' });

    const response = await axios.get('https://openlibrary.org/search.json', {
      params: { title, limit: 5 }
    });

    const results = response.data.docs.map((doc) => ({
      title: doc.title,
      author: doc.author_name ? doc.author_name[0] : 'Unknown',
      year: doc.first_publish_year || null
    }));

    res.json(results);
  } catch (error) { next(error); }
}

module.exports = { search };
