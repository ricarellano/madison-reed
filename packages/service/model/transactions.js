//Single account to be used with transactions
const account = {
  name: 'Jhon Smith',
  number: '1234-5678-9',
  type: 'savings',
  total: 100,
  history:[]
}

exports.DEBIT_TYPE = 'debit'
exports.CREDIT_TYPE = 'credit'



exports.getAccount = () => {
  return account
}

exports.saveTransaction = (total, transaction) => {
  account.total = total
  account.history.push(transaction)

  return account
}
