import axios from 'axios'

const server = 'https://backend-32sa.onrender.com'

export async function sendSignedOrder(signedMessage) {
  const response = await axios.post(
    `${server}/api/signedMessage`,
    signedMessage
  )
  return response.data
}

// export async function getAllUsers() {
//   try {
//     const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
//     console.log('response  ', response)
//     return response.data
//   } catch (error) {
//     return []
//   }
// }
