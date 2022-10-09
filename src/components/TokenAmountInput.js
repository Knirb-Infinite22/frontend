import { Form } from 'react-bootstrap'
import { useRef } from 'react'
import { tokens } from '../utils/tokens'

export const TokenAmountInput = (props) => {
  const {
    label,
    inputValue,
    tokenValue,
    handleTokenChange,
    handleInputChange,
    fromBalance,
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
        <Form.Select
          onChange={handleTokenChange}
          defaultValue={tokenValue}
          className='select'
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
      {label === 'FROM' && (
        <p className='balance-subtext'>balance : {fromBalance}</p>
      )}
      <br />
    </>
  )
}
