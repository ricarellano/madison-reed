const request = require('supertest');
const express = require('express');
const app = require('../../app')
const transactionsModel = require('../../model/transactions')

describe('GET /transactions', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    jest.resetAllMocks()
  })
  test('return empty history', (done) => {
    const mockResponse = {
        total: 1000,
        history: []
      }
    transactionsModel.getAccount = jest.fn()
      .mockImplementationOnce(() => (mockResponse))

    request(app)
      .get('/transactions')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const { text } = response
        const jsonData = JSON.parse(text)
        expect(jsonData).toEqual(mockResponse)
        done()
      })
  })
  
  test('return current history', (done) => {
    const mockResponse = {
        total: 1000,
        history: [
          {
            ammount: 100,
            type: 'debit',
            time: 12312312,
            description: 'Buy groceries'
          }, {
            ammount: 50,
            type: 'credit',
            time: 12312312,
            description: 'payment'
          }
        ]
      }
    transactionsModel.getAccount = jest.fn()
      .mockImplementationOnce(() => (mockResponse))

    request(app)
      .get('/transactions')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const { text } = response
        const jsonData = JSON.parse(text)
        expect(jsonData).toEqual(mockResponse)
        done()
      })
  })
})


