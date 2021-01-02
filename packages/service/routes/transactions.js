var express = require('express');
var router = express.Router();
var transactionsController = require('../controllers/transactions')

/* GET users listing. */
router.get('/', transactionsController.getTransactions);

router.post('/debit', transactionsController.addDebit);

router.post('/credit', transactionsController.addCredit);

module.exports = router;
