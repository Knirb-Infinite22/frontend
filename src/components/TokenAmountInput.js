import { Card } from 'react-bootstrap'
import { Form } from 'react-bootstrap'

export const TokenAmountInput = (props) => {
  const {
    label,
    // setInput,
    inputValue,
    handleTokenChange,
    handleInputChange,
    ref,
  } = props

  return (
    <>
      <label className='label'>{label}:</label>
      <br />
      <div className='token-input-wrapper'>
        <Form.Select onChange={handleTokenChange}>
          <option value='2'>DAI</option>
          <option value='1'>WETH</option>
        </Form.Select>
        <input
          type='number'
          className='input'
          value={inputValue}
          ref={ref}
          onChange={(e) => {
            handleInputChange(e)
          }}
        />
      </div>
      <br />
    </>
  )
}
