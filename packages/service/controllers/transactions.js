var model = require('../model/transactions')
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

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
     res.send({ total, history})
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
      transaction.status = 'SUCCESS'
      model.saveTransaction(newTotal, transaction)
    } else {
      transaction.status = 'FAILED'
      model.saveTransaction(total, transaction)
    }
    done()
  }, function(err, ret) {
    if(transaction.status === 'SUCCESS')
      res.send('TransactionCreated')
    else 
      res.send('Transaction failed')
    }, {});
}

exports.addCredit = (req, res) => {
  const { body } = req
  const { ammount, description } = body
  const transaction = createTransaction(ammount, model.DEBIT_TYPE, description)
  lock.acquire("key", function(done) {
    const { total } = model.getAccount()
    const newTotal = total + transaction.ammount
    transaction.status = 'SUCCESS'
    model.saveTransaction(newTotal, transaction)
    done()
  }, function(err, ret) {
    if(transaction.status === 'SUCCESS')
      res.send('TransactionCreated')
    else 
      res.send('Transaction failed')
    }, {});
}
