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



exports.getHistory = () => {
  return account
}

exports.addTransaction = (transaction) => {
  let newTotal = account.total
  if(transaction.type === this.DEBIT_TYPE) {
    newTotal -= transaction.ammount
  } else {
    newTotal += transaction.ammount
  }
  if(newTotal >= 0) {
    account.total = newTotal
    transaction.status = 'SUCCESS'
  } else {
    transaction.status = 'FAILED'
  }
  account.history.push(transaction)
  return transaction.status === 'SUCCESS'
}
