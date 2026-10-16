const router = require('express').Router();
const controller = require('./userController');

router.get('/', controller.listUsers);
router.post('/', controller.createUser);
router.delete('/:id', controller.deleteUser);
router.get('/loans/all', controller.listLoans);
router.post('/loans', controller.createLoan);
router.put('/loans/:id/return', controller.returnLoan);

module.exports = router;
