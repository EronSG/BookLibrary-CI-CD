const router = require('express').Router();
const controller = require('./libraryController');

router.get('/search', controller.search);

module.exports = router;
