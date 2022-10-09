// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useState, useRef } from 'react'
import knirb from './static/knirb.png'
import ethereum from './static/ethereum.svg'
import dai from './static/dai.png'
import { ethers } from 'ethers'
import { Button, Form } from 'react-bootstrap'
import { signOrder } from './utils/signOrder'
import { WalletInfo } from './components/WalletInfo'
import { sendSignedOrder } from './services/SignerService'
import { TokenAmountInput } from './components/TokenAmountInput'

function App() {
  const [from, setFrom] = useState('')
  const [fromToken, setFromToken] = useState(1)
  const [toToken, setToToken] = useState(1)
  const [to, setTo] = useState('')
  const [dataAddress, setDataAddress] = useState({
    address: '',
    balance: null,
  })
  const [submitBtnDisable, setsubmitBtnDisable] = useState(true)

  const fromRef = useRef()
  const toRef = useRef()

  const connectBtnHandler = () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((res) => setAccountData(res[0]))
    } else {
      alert('install metamask extension!!')
    }
  }

  const getBalance = async (address) => {
    return window.ethereum
      .request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      .then((balance) => {
        return ethers.utils.formatEther(balance)
      })
  }

  const setAccountData = async (account) => {
    const balance = await getBalance(account)

    setDataAddress({
      address: account,
      balance: balance,
    })
  }

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
      dataAddress.address,
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
        <WalletInfo dataAddress={dataAddress} />
        <Button
          onClick={connectBtnHandler}
          className='connectButton'
          variant='primary'
        >
          {dataAddress.address ? 'Connected' : 'Connect to wallet'}
        </Button>
      </header>
      <body className='App-header'>
        <form
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
        </form>
      </body>
    </div>
  )
}

export default App
