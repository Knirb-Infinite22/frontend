// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState, useEffect } from 'react'
import knirb from './static/knirb.png'
import { ethers } from 'ethers'
import { Button, Form } from 'react-bootstrap'
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
  const [walletData, setWalletData] = useState({
    address: '',
    balance: null,
  })
  const [submitBtnDisable, setsubmitBtnDisable] = useState(true)

  const validInputs = () => {
    console.log(`from validinput: ${from}`)

    return from && to && from > 0 && to > 0
  }

  useEffect(() => {
    console.log(`from: ${from}`)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }, [from, to])

  const handleFromInputChange = (e) => {
    e.preventDefault()
    setFrom(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)

    // validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleToInputChange = (e) => {
    setTo(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleFromTokenChange = (e) => {
    e.preventDefault()

    console.log(e.target.value)
    setFromToken(e.target.value)

    const token = tokens[fromToken]
    console.log(`token.name: ${token.name}`)

    console.log(`fromToken: ${fromToken}`)
  }

  const handleToTokenChange = (e) => {
    setToToken(e.target.value)
    console.log(`toToken: ${toToken}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    await provider.send('eth_requestAccounts', [])

    const signer = provider.getSigner()

    const fromTokenAddress = tokens[fromToken].contractAddress
    const toTokenAddress = tokens[toToken].contractAddress

    console.log(`fromTokenAddress: ${fromTokenAddress}`)
    console.log(`toTokenAddress: ${toTokenAddress}`)

    const signedOrderResponse = await signOrder(
      signer,
      walletData.address,
      fromTokenAddress,
      toTokenAddress,
      from,
      to
    )
    console.log({ signedOrderResponse })
    if (signedOrderResponse.signedMessage && signedOrderResponse.data) {
      alert('order signed!')
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
      </body>
    </div>
  )
}

export default App
