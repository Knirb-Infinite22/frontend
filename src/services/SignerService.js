import axios from 'axios'

const server = 'https://backend-32sa.onrender.com'

export async function sendSignedOrder(signedMessage) {
  console.log(`signedMessage:`)
  console.log({ signedMessage })
  const response = await axios.post(`${server}/api/signedMsg`, signedMessage)
  return response.data
}

export async function getOrdersBySigner(addresss) {
  console.log(`addresss: ${addresss}`)
  const address = '0x9578e973bbA0Cc33BDbc93C7f77bb3fe6D47d68a'

  // console.log(`address: ${address}`)
  // console.log(`addresss: ${addresss}`)
  if (!address) {
    return
  }

  const response = await axios.get(
    `${server}/api/signerMsgs/${address.toString()}`
  )

  let arrayOfOrders = []

  return response.data.map((e) => {
    arrayOfOrders.push({
      tokenIn: e.signedMessage.signedParams[1].callData.params[2].value,
      tokenOut: e.signedMessage.signedParams[1].callData.params[3].value,
      inAmount: e.signedMessage.signedParams[1].callData.params[4].value,
      toAmount: e.signedMessage.signedParams[1].callData.params[5].value,
    })

    console.log(`arrayOfOrders: `)
    console.log({ arrayOfOrders })

    return arrayOfOrders
    // const tokenIn = e.signedMessage.signedParams[1].callData.params[2].value
    // const tokenOut = e.signedMessage.signedParams[1].callData.params[3].value
    // const inAmount = parseInt(
    //   e.signedMessage.signedParams[1].callData.params[4].value.hex,
    //   16
    // )
    // const toAmount = parseInt(
    //   e.signedMessage.signedParams[1].callData.params[5].value.hex,
    //   16
    // )
  })
}
