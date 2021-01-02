const request = require('supertest');
const app = require('../../app')

describe('POST /transactions/debit', () => {
  test('return error for wrong body', (done) => {
    request(app)
      .post('/transactions/debit')
      .expect(400)
      .then(response => {
        const { text } = response
        expect(text).toMatch(/Error validating request body/)
        done()
      })
  })
  
  test('Create a debit transaction', (done) => {

    const transactionDebit = {
      ammount: 10,
      description: 'some description'
    }

    request(app)
      .get('/transactions')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const { text } = response
        const jsonData = JSON.parse(text)
        const { total: firstTotal, history: firstHistory } = jsonData

        expect(firstTotal).toEqual(100)
        expect(firstHistory).toHaveLength(0)

        request(app)
          .post('/transactions/debit')
          .send(transactionDebit)
          .expect(201)
          .then(response => {
            const { text } = response
            expect(text).toMatch(/transaction created/i)
            request(app)
              .get('/transactions')
              .expect('Content-Type', /json/)
              .expect(200)
              .then(response => {
                const { text } = response
                const jsonData = JSON.parse(text)
                const { total, history } = jsonData
                expect(total).toEqual(firstTotal - transactionDebit.ammount)
                expect(history).toHaveLength(1)
                done()
              })
          })
      })

  })
  
  test('Create a transaction out of funds', (done) => {

    const transactionDebit = {
      ammount: 10000,
      description: 'some description'
    }
    request(app)
      .post('/transactions/debit')
      .send(transactionDebit)
      .expect(406)
      .then(response => {
        const { text } = response
        expect(text).toMatch(/Selected account doesn't have the required funds/i)
        done()
      })

  })
})

describe('POST /transactions/credit', () => {
  test('return error for wrong body', (done) => {
    request(app)
      .post('/transactions/credit')
      .expect(400)
      .then(response => {
        const { text } = response
        expect(text).toMatch(/Error validating request body/)
        done()
      })
  })
  
  test('add credit with negative number', (done) => {
    request(app)
      .post('/transactions/credit')
      .send({ ammount: -10, description: 'description'})
      .expect(400)
      .then(response => {
        const { text } = response
        expect(text).toMatch(/Error validating request body/)
        done()
      })
  })
  
  test('Create a credit transaction', (done) => {

    const transactionCredit = {
      ammount: 10,
      description: 'some description'
    }

    request(app)
      .get('/transactions')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const { text } = response
        const jsonData = JSON.parse(text)
        const { total: firstTotal, history: firstHistory } = jsonData

        request(app)
          .post('/transactions/credit')
          .send(transactionCredit)
          .expect(201)
          .then(response => {
            const { text } = response
            expect(text).toMatch(/transaction created/i)
            request(app)
              .get('/transactions')
              .expect('Content-Type', /json/)
              .expect(200)
              .then(response => {
                const { text } = response
                const jsonData = JSON.parse(text)
                const { total, history } = jsonData
                expect(total).toEqual(firstTotal + transactionCredit.ammount)
                expect(history).toHaveLength(firstHistory.length + 1)
                done()
              })
          })
      })

  })

})
