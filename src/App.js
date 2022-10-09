// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { useEffect, useState } from 'react'
import knirb from './static/knirb.png'
import { ethers } from 'ethers'
import { Button, Form, Toast, Table } from 'react-bootstrap'
import { signOrder } from './utils/signOrder'
import { WalletData } from './components/WalletData'
import { getOrdersBySigner, sendSignedOrder } from './services/SignerService'
import { TokenAmountInput } from './components/TokenAmountInput'
import { ConnectButton } from './components/ConnectButton'
import { tokens } from './utils/tokens'
import { daiAbi } from './abis/daiAbi'

function App() {
  const [from, setFrom] = useState('')
  const [fromToken, setFromToken] = useState(null)
  const [toToken, setToToken] = useState(null)
  const [to, setTo] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [fromBalance, setFromBalance] = useState(null)

  const [dataTable, setDataTable] = useState(null)
  const [walletData, setWalletData] = useState({
    address: '',
    balance: null,
  })

  // useEffect(() => {
  //   console.log(`entre al useffect`)
  //   const fetchData = async () => {
  //     // const dataTable = await getOrdersBySigner(walletData.address)
  //     setDataTable(dataTable)
  //   }

  //   fetchData()
  // }, [walletData])

  const [submitBtnDisable, setsubmitBtnDisable] = useState(true)

  const validInputs = () => {
    return from && to && from > 0 && to > 0
  }

  const handleFromInputChange = async (e) => {
    e.preventDefault()
    setFrom(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleToInputChange = (e) => {
    e.preventDefault()
    setTo(e.target.value)
    validInputs() ? setsubmitBtnDisable(false) : setsubmitBtnDisable(true)
  }

  const handleFromTokenChange = async (e) => {
    e.preventDefault()
    setFromToken(e.target.value)

    console.log(tokens[e.target.value].contractAddress)
    console.log(walletData.address)
    // const provider = new ethers.providers.Web3Provider(window.ethereum)

    // const contract = new ethers.Contract(
    //   tokens[e.target.value].contractAddress,
    //   daiAbi,
    //   provider
    // )

    // const balance = await contract.balanceOf(walletData.address)

    // console.log(`balance: ${balance}`)

    // setFromBalance(balance.toString())
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
          <img src={knirb} alt='knirb' className='img-logo' />
          <h2 className='title'> KNIRB </h2>
          <h3 className='subtitle'> - stop loss made simple - </h3>
          <div className='labelsContainer'>
            <TokenAmountInput
              label='FROM'
              inputValue={from}
              tokenValue={fromToken}
              handleTokenChange={handleFromTokenChange}
              handleInputChange={handleFromInputChange}
              fromBalance={fromBalance}
            />
            <TokenAmountInput
              label='TO'
              inputValue={to}
              tokenValue={toToken}
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
        {dataTable && (
          <div className='orders-table'>
            <h1>Orders List</h1>
            <Table>
              <thead>
                <tr>
                  <th>Token From </th>
                  <th>Amout From</th>
                  <th>Token To</th>
                  <th>Amount To</th>
                </tr>
              </thead>
              <tbody>
                {dataTable?.map((value, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        {
                          tokens.find(
                            (t) => t.contractAddress === value[0].tokenIn
                          ).name
                        }
                      </td>
                      <td>{value[0].inAmount}</td>
                      <td>
                        {
                          tokens.find(
                            (t) => t.contractAddress === value[0].tokenOut
                          ).name
                        }
                      </td>
                      <td>{value[0].toAmount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
        {/* <Table striped bordered hover className='orders-table'>
          <thead>
            <tr>
              <th>#</th>

              <th>From Token</th>
              <th>From amount</th>
              <th>To token</th>
              <th>To amount</th>
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
