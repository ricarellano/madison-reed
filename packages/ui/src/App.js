import { useEffect, useState } from 'react'
import { Spinner, Col, Row, Accordion, Card, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

const URL = 'http://localhost:4000/transactions'


function App() {

  const [total, setTotal] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const response = await axios.get(URL)
      if(response.status === 200) {
        const body = response.data
        if(!isNaN(body.total)){
          setTotal(body.total.toFixed(2))
        }
        setHistory(body.history)
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  return (
    <Container style={{margin: '2rem'}}>
      {
        isLoading ? (<Spinner data-testid="spinner" animation="border" />)
        : (
          <>
            <Row>
            <Col><h1>Account</h1></Col>
            <Col style={{display: 'flex',justifyContent:'flex-end'}}>Total: ${total}</Col>
            </Row>
            <Row>
              <Col>
                <Accordion defaultActiveKey="0" as="ul">
                  {
                    history.map((transaction, index) => (
                      <Card key={index} as="li">
                        <Accordion.Toggle as={Card.Header} eventKey={`${index}`} style={{ backgroundColor: transaction.status === 'SUCCESS' ? 'white' : 'lightred', display: 'flex', justifyContent:'space-between'}}>
                          <span>{transaction.type}</span><span>$ {transaction.ammount.toFixed(2)}</span>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={`${index}`}>
                          <Card.Body style={{display: 'flex', flexDirection:'column'}}>
                            <span>Description: {transaction.description}</span>
                            <span>Date: {new Date(transaction.time).toLocaleString()}</span>
                            <span>Status: {transaction.status}</span>
                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    ))
                  }
                </Accordion>
              </Col>
            </Row>
          </>
        )
      }
    </Container>
  );
}

export default App;
