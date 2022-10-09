import { daiAbi } from '../abis/daiAbi'

const { ethers } = require('ethers')
const brink = require('@brinkninja/sdk')
const implementationArtifacts = require('./implementation')
const verifierArtifacts = require('./verifier')

// Call function to create new order message object
export async function signOrder(
  provider,
  signer,
  signerAddress,
  tokenIn,
  tokenOut,
  inAmount,
  outAmount
) {
  const implementation = new ethers.Contract(
    implementationArtifacts.address,
    implementationArtifacts.abi
  )

  const accountSigner = brink.accountSigner(signer, 'goerli')

  const fromContract = new ethers.Contract(tokenIn, daiAbi, signer)

  const accountSignerAddress = await accountSigner.accountAddress()

  await fromContract.approve(accountSignerAddress, inAmount)

  const call = {
    functionName: 'tokenToToken',
    paramTypes: [
      { name: 'bitmapIndex', type: 'uint256', signed: true },
      { name: 'bit', type: 'uint256', signed: true },
      { name: 'tokenIn', type: 'address', signed: true },
      { name: 'tokenOut', type: 'address', signed: true },
      { name: 'tokenInAmount', type: 'uint256', signed: true },
      { name: 'tokenOutAmount', type: 'uint256', signed: true },
      { name: 'expiryBlock', type: 'uint256', signed: true },
      { name: 'recipient', type: 'address', signed: false },
      { name: 'to', type: 'address', signed: false },
      { name: 'data', type: 'bytes', signed: false },
    ],
    params: [
      '0',
      '1',
      tokenIn,
      tokenOut,
      inAmount,
      outAmount,
      '999999999999999999999999',
    ],
  }

  const signedMessage = await accountSigner.signMetaDelegateCall(
    verifierArtifacts.address,
    call
  )

  const data = await implementation.populateTransaction.tokensToToken(
    signerAddress,
    [tokenIn],
    tokenOut,
    [inAmount],
    outAmount
  )

  return { signedMessage, data }
}
