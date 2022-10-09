import { Form } from 'react-bootstrap'
import { useRef } from 'react'
import { tokens } from '../utils/tokens'

export const TokenAmountInput = (props) => {
  const {
    label,
    inputValue,
    defaultTokenValue,
    handleTokenChange,
    handleInputChange,
  } = props

  const inputRef = useRef()

  const handleAmountChange = (e) => {
    handleInputChange(e)
    console.log(`handleAmountChange: ${e.target.value}`)
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
        <Form.Select
          onChange={handleTokenChange}
          defaultValue={defaultTokenValue}
        >
          {tokens.map((elem, index) => (
            <option key={index} value={index} className='element'>
              {elem.name}
            </option>
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
