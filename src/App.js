// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState, useRef } from 'react'
import knirb from './static/knirb.png'
import ethereum from './static/ethereum.svg'
import dai from './static/dai.png'
import { ethers } from 'ethers'
import { Button, Form } from 'react-bootstrap'
import { signOrder } from './utils/signOrder'
import { WalletData } from './components/WalletData'
import { sendSignedOrder } from './services/SignerService'
import { TokenAmountInput } from './components/TokenAmountInput'
import { ConnectButton } from './components/ConnectButton'

function App() {
  const [from, setFrom] = useState('')
  const [fromToken, setFromToken] = useState(1)
  const [toToken, setToToken] = useState(2)
  const [to, setTo] = useState('')
  const [walletData, setwalletData] = useState({
    address: '',
    balance: null,
  })
  const [submitBtnDisable, setsubmitBtnDisable] = useState(true)

  const validInputs = () => {
    return from && to && from > 0 && to > 0
  }

  const handleFromChange = (e) => {
    e.preventDefault()
    setFrom(e.target.value)

    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleToChange = (e) => {
    setTo(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleFromTokenChange = (e) => {
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

    const wethAddress = '0x8B7FB00ABb67ba04CE894B9E2769fe24A8409a6a'
    const daiAddress = '0xf2edF1c091f683E3fb452497d9a98A49cBA84666'

    const signedOrderResponse = await signOrder(
      signer,
      walletData.address,
      wethAddress,
      daiAddress,
      from,
      to
    )
    if (signedOrderResponse.signedMessage && signedOrderResponse.data) {
      alert('order signed!')
      sendSignedOrder(signedOrderResponse)
    }
  }

  return (
    <div className='App'>
      <header>
        <WalletData walletData={walletData} />
        <ConnectButton walletData={walletData} setwalletData={setwalletData} />
      </header>
      <body className='App-header'>
        <Form
          onSubmit={(e) => {
            handleSubmit(e)
          }}
        >
          <img src={knirb} alt='knirb' />
          <h2> Knirb </h2>
          <div className='labelsContainer'>
            <TokenAmountInput
              label='From'
              inputValue={from}
              handleTokenChange={handleFromTokenChange}
              handleInputChange={handleFromChange}
            />
            <TokenAmountInput
              label='To'
              inputValue={to}
              handleTokenChange={handleToTokenChange}
              handleInputChange={handleToChange}
            />
            <Button
              type='submit'
              disabled={submitBtnDisable}
              className='submit-btn'
            >
              Sign Order
            </Button>
          </div>
        </Form>
      </body>
    </div>
  )
}

export default App
