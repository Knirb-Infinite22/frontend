import { Form, Card } from 'react-bootstrap'
import { useRef } from 'react'

const tokens = [
  {
    name: 'WETH',
    contractAddress: '0x8B7FB00ABb67ba04CE894B9E2769fe24A8409a6a',
  },
  {
    name: 'DAI',
    contractAddress: '0xf2edF1c091f683E3fb452497d9a98A49cBA84666',
  },
]

export const TokenAmountInput = (props) => {
  const {
    label,
    // setInput,
    inputValue,
    handleTokenChange,
    handleInputChange,
  } = props

  const inputRef = useRef()

  const handleAmountChange = (e) => {
    handleInputChange(e)
    if (inputValue && inputValue > 0) {
      inputRef.current.className = 'input valid'
    } else {
      inputRef.current.className = 'input invalid'
    }
  }

  return (
    <>
      <label className='label'>{label}:</label>
      <br />
      <div className='token-input-wrapper'>
        <Form.Select onChange={handleTokenChange}>
          {tokens.map((elem, index) => (
            <option value={index}>{elem.name}</option>
          ))}
        </Form.Select>
        <input
          type='number'
          className='input'
          value={inputValue}
          ref={inputRef}
          onChange={(e) => {
            handleAmountChange(e)
          }}
        />
      </div>
      <br />
    </>
  )
}
