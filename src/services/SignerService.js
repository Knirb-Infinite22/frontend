import axios from 'axios'

const server = 'https://backend-32sa.onrender.com'

export async function sendSignedOrder(signedMessage) {
  console.log(`signedMessage:`)
  console.log({ signedMessage })
  const response = await axios.post(`${server}/api/signedMsg`, signedMessage)
  return response.data
}
