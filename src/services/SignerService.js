import axios from 'axios'

export async function sendSignedOrder(data) {
  const response = await axios.post(`/api/user`, { user: data })
  return response.data
}

export async function getAllUsers() {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
    console.log('response  ', response)
    return response.data
  } catch (error) {
    return []
  }
}
