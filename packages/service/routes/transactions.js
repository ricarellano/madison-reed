const Joi = require('joi')
const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions')
const validator = require('express-joi-validation').createValidator({})

const bodySchema = Joi.object({
  ammount: Joi.number().min(0).required(),
  description: Joi.string().required()
})

/* GET users listing. */
router.get('/', transactionsController.getTransactions);

router.post('/debit', validator.body(bodySchema), transactionsController.addDebit);

router.post('/credit', validator.body(bodySchema), transactionsController.addCredit);

module.exports = router;
