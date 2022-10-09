// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState, useEffect } from 'react'
import knirb from './static/knirb.png'
import { ethers } from 'ethers'
import { Button, Form, Toast, Table } from 'react-bootstrap'
import { signOrder } from './utils/signOrder'
import { WalletData } from './components/WalletData'
import { sendSignedOrder } from './services/SignerService'
import { TokenAmountInput } from './components/TokenAmountInput'
import { ConnectButton } from './components/ConnectButton'
import { tokens } from './utils/tokens'

function App() {
  const [from, setFrom] = useState('')
  const [fromToken, setFromToken] = useState(0)
  const [toToken, setToToken] = useState(1)
  const [to, setTo] = useState('')
  const [showToast, setShowToast] = useState(false)

  const [walletData, setWalletData] = useState({
    address: '',
    balance: null,
  })
  const [submitBtnDisable, setsubmitBtnDisable] = useState(true)

  const validInputs = () => {
    console.log(`from validinput: ${from}`)

    return from && to && from > 0 && to > 0
  }

  const handleFromInputChange = (e) => {
    e.preventDefault()
    setFrom(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleToInputChange = (e) => {
    e.preventDefault()
    setTo(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleFromTokenChange = (e) => {
    e.preventDefault()

    console.log(e.target.value)
    setFromToken(e.target.value)
  }

  const handleToTokenChange = (e) => {
    setToToken(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    await provider.send('eth_requestAccounts', [])

    const signer = provider.getSigner()

    const fromTokenAddress = tokens[fromToken].contractAddress
    const toTokenAddress = tokens[toToken].contractAddress

    const signedOrderResponse = await signOrder(
      provider,
      signer,
      walletData.address,
      fromTokenAddress,
      toTokenAddress,
      from,
      to
    )
    console.log({ signedOrderResponse })
    if (signedOrderResponse.signedMessage && signedOrderResponse.data) {
      setShowToast(true)
      sendSignedOrder(signedOrderResponse)
    }
  }

  return (
    <div className='App'>
      <header>
        <WalletData walletData={walletData} />
        <ConnectButton walletData={walletData} setWalletData={setWalletData} />
      </header>
      <body className='App-header'>
        <Form
          onSubmit={(e) => {
            handleSubmit(e)
          }}
        >
          <img src={knirb} alt='knirb' />
          <h2 className='title'> KNIRB </h2>
          <div className='labelsContainer'>
            <TokenAmountInput
              label='FROM'
              inputValue={from}
              defaultTokenValue={fromToken}
              handleTokenChange={handleFromTokenChange}
              handleInputChange={handleFromInputChange}
            />
            <TokenAmountInput
              label='TO'
              inputValue={to}
              defaultTokenValue={toToken}
              handleTokenChange={handleToTokenChange}
              handleInputChange={handleToInputChange}
            />
            <Button
              type='submit'
              disabled={submitBtnDisable}
              className='submit-btn'
            >
              SIGN ORDER
            </Button>
          </div>
        </Form>
        {/* <Table striped bordered hover className='orders-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table> */}
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          position={'middle-center'}
          autohide
        >
          <Toast.Header>
            <img src={knirb} className='rounded me-2 imgToast' alt='knirb' />
            <strong className='me-auto'>Knirb</strong>
            {/* <small>11 mins ago</small> */}
          </Toast.Header>
          <Toast.Body>Woohoo, order signed!</Toast.Body>
        </Toast>
      </body>
    </div>
  )
}

export default App
