import { Card } from 'react-bootstrap'

export const WalletInfo = (props) => {
  const { dataAddress } = props

  return (
    <Card className='account-data-card'>
      <Card.Header>
        <strong>Address: </strong>
        {dataAddress.address}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>Balance: </strong>
          {dataAddress.balance}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
