import { Link } from 'react-router-dom'
import styled from 'styled-components'
import React from 'react'

import { InputGroup } from '../styles/styles'
import { useControl } from './FormControl'
import EmailsInput from './EmailsInput'
import Location from './Location'

const EditGroupForm = ({ disabled }: { disabled?: boolean }) => {
  return (
    <div style={{ width: '100%', maxWidth: '30rem' }}>
      <Input
        disabled={disabled}
        name="name"
        init=""
        valid={(x) => x.length > 0 || 'Must provide a group name'}
        placeholder="Group name"
      />

      <Input
        disabled={disabled}
        name="link_facebook"
        init=""
        valid={(x) => validURL(x) || 'Must provide valid Group URL'}
        placeholder="https://www.f..."
      />

      <div>
        <Description>
          Enter any emails for people you want to give access to edit this group{' '}
          <small style={{ color: 'grey' }}>(These will not be public)</small>
        </Description>
        <EmailsInput />
      </div>

      <div style={{ marginTop: '2rem', opacity: disabled ? '.8' : 1 }}>
        <Location />
      </div>

      <FormButtons>
        <Link to="/">
          <button className="btn-secondary" type="button" disabled={disabled}>
            cancel
          </button>
        </Link>
        <button type="submit" disabled={disabled}>
          submit
        </button>
      </FormButtons>
    </div>
  )
}

export default EditGroupForm

const Input = <T extends any>({
  name,
  init,
  valid,
  description,
  ...inputProps
}: {
  name: string
  init: T
  description?: string
  valid?: (x: T) => string | true
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { error, props } = useControl(name, init, valid)
  return (
    <div style={{ margin: '1rem 0' }}>
      {description && <Description>{description}</Description>}
      {/* <Error>{error}</Error> */}
      <InputGroup>
        <input
          style={{
            backgroundColor: error ? 'inherit' : 'rgba(0, 255, 0, 0.05)',
          }}
          {...inputProps}
          {...props}
        />
      </InputGroup>
    </div>
  )
}

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`

const Description = styled.p`
  padding: 0 1rem;
  margin: 0.5rem 0rem 0.5rem 0rem;
`

export function validURL(str: string) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator

  return !!pattern.test(str)
}
