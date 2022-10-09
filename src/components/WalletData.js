import { Card } from 'react-bootstrap'

export const WalletData = (props) => {
  const { walletData } = props

  return (
    <Card className='account-data-card'>
      <Card.Header>
        <strong>Address: </strong>
        {walletData.address}
      </Card.Header>
      <Card.Body>
        <Card.Text>
          <strong>Balance: </strong>
          {walletData.balance}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
