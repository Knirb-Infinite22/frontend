import { Button } from 'react-bootstrap'
import { ethers } from 'ethers'

export const ConnectButton = (props) => {
  const { walletData, setWalletData } = props

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

  const setAccountData = async (account) => {
    const balance = await getBalance(account)

    setWalletData({
      address: account,
      balance: balance,
    })
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

  return (
    <Button
      onClick={connectBtnHandler}
      className='connectButton'
      variant='primary'
    >
      {walletData.address ? 'Connected' : 'Connect to wallet'}
    </Button>
  )
}
