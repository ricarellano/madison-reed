import { render, screen } from '@testing-library/react';
import App from './App';
import moxios from 'moxios'

describe('App container', () => {

  beforeEach(function () {
    moxios.install()
  })

  afterEach(function () {
    moxios.uninstall()
  })
  
  test('renders loading spinner', async () => {
    render(<App />)
    const spinner = await screen.findByTestId('spinner')
    expect(spinner).toBeInTheDocument()
  })


  test('renders empty history', async () => {
    render(<App />)
    
    moxios.stubRequest('http://localhost:4000/transactions', {
      status: 200,
       response:  {
          total: 200,
         history: []
       }
    })

    const accountTitle = await screen.findByText(/account/i)
    expect(accountTitle).toBeInTheDocument()
    const totalTitle = await screen.findByText(/total/i)
    expect(totalTitle).toBeInTheDocument()
  });
  
  test('renders history', async () => {
    render(<App />)

    const response = {
      total: 200,
      history: [
        {
          ammount: 10, type: 'debit', status: 'FAILED', description: 'Netflix', time:1609628555812
        }, {
          ammount: 10, type: 'debit', status: 'SUCCESS', description: 'Happy Birthday', time:1609628555812
        }, {
          ammount: 100, type: 'debit', status: 'SUCCESS', description: 'some description', time:1609628555812
        }, {
          ammount: 1000, type: 'credit', status: 'SUCCESS', description: 'some description', time:1609628555812
        }
      ]
    }
    
    moxios.stubRequest('http://localhost:4000/transactions', {
      status: 200,
      response: response
    })

    const accountTitle = await screen.findByText(/account/i)
    expect(accountTitle).toBeInTheDocument()
    const totalTitle = await screen.findByText(/total/i)
    expect(totalTitle).toBeInTheDocument()

    const transactionItems = await screen.findAllByRole('listitem')
    expect(transactionItems).toHaveLength(response.history.length)

    const itemInHistory = response.history[0]
    const formattedDate = new Date(itemInHistory.time).toLocaleString()
    expect(transactionItems[0]).toHaveTextContent(itemInHistory.description)
    expect(transactionItems[0]).toHaveTextContent(formattedDate)
  });
})
