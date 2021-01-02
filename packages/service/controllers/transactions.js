var model = require('../model/transactions')

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
  res.send(model.getHistory())
}

exports.addDebit = (req, res) => {
  const { body } = req
  const { ammount, description } = body
  const transaction = createTransaction(ammount, model.DEBIT_TYPE, description)
  if(model.addTransaction(transaction)){
    res.send('TransactionCreated')
  }
  res.send('Transaction failed')
}

exports.addCredit = (req, res) => {
  const { body } = req
  const { ammount, description } = body
  const transaction = createTransaction(ammount, model.CREDIT_TYPE, description)
  if(model.addTransaction(transaction)){
    res.send('TransactionCreated')
  }
  res.send('Transaction failed')
}
