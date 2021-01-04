const model = require('../model/transactions')
const AsyncLock = require('async-lock');
const lock = new AsyncLock();


const createTransaction = (ammount, type, description) => {
  const time = new Date().getTime()
  return {
    ammount,
    type,
    time,
    description,
  }
}

exports.getTransactions = (req, res) => {
  lock.acquire("key", function(done) {done()},
    function(err, ret) {
     const { total, history} = model.getAccount()
      res.setHeader('Content-Type', 'application/json');
     res.status(200).send({ total, history})
    }, {});
}

exports.addDebit = (req, res) => {
  const { body } = req
  const { ammount, description } = body
  const transaction = createTransaction(ammount, model.DEBIT_TYPE, description)
  lock.acquire("key", function(done) {
    const { total } = model.getAccount()
    const newTotal = total - transaction.ammount
    if(newTotal >= 0) {
      transaction.status = model.SUCCESS
      model.saveTransaction(newTotal, transaction)
    } else {
      transaction.status = model.FAILED
      model.saveTransaction(total, transaction)
    }
    done()
  }, function(err, ret) {
    if(transaction.status === model.SUCCESS)
      res.status(201).send('Transaction created')
    else 
      res.status(406).send(`Selected account doesn't have the required funds`)
    }, {});
}

exports.addCredit = (req, res) => {
  const { body } = req
  const { ammount, description } = body
  const transaction = createTransaction(ammount, model.CREDIT_TYPE, description)
  lock.acquire("key", function(done) {
    const { total } = model.getAccount()
    const newTotal = total + transaction.ammount
    transaction.status = model.SUCCESS
    model.saveTransaction(newTotal, transaction)
    done()
  }, function(err, ret) {
    if(transaction.status === model.SUCCESS)
      res.status(201).send('Transaction created')
    else 
      res.status(406).send(`Selected account does'nt have the required funds`)
    }, {});
}
