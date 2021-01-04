import transactionFixture from '../fixtures/example.json'

describe('App component', () => {
  it('renders Page with account stubing request', () => {

    cy.intercept(
      {
        method: 'GET',      // Route all GET requests
        url: 'http://localhost:4000/transactions',    // that have a URL that matches '/users/*'
      },
      transactionFixture
    )
    cy.visit('/')

    cy.get('h1').should('contain', 'Account')
    cy.contains(`Total: $${transactionFixture.total.toFixed(2)}`)


    const firstTransition = transactionFixture.history[0]
    cy.contains(`$ ${firstTransition.ammount.toFixed(2)}`)
    cy.get('ul li:first').click()
    cy.contains(`Status: ${firstTransition.status}`)

    const lastTransition = transactionFixture.history[transactionFixture.history.length -1]
    cy.contains(`$ ${lastTransition.ammount.toFixed(2)}`)
    cy.get('ul li:last').click()
    cy.contains(`Status: ${lastTransition.status}`)

  })
  
  it('renders Page with account real request', () => {

    let total = 0
    let history = []



    cy.visit('/')

    cy.server()
    
    cy.route('GET', 'http://localhost:4000/transactions').as('getAll')
    cy.wait('@getAll')
      .then(({response}) => {
        total = response.body.total
        history = response.body.history


        cy.contains('Account')
        cy.contains(`Total: $${total.toFixed(2)}`)
      })


    cy.request('POST', 'http://localhost:4000/transactions/credit', {
      ammount: 10,
      description: 'test'
    })

    const firstTransition = transactionFixture.history[0]
    cy.contains(`$ 10.00`)
    cy.get('ul li:first').click()
    cy.contains(`Status: SUCCESS`)

  })
})
