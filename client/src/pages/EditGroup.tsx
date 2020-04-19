import { useParams, Link, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { useRequest } from '../contexts/RequestProvider'
import { Group } from '../utils/types'
import { EditPage, CenterAlign } from '../styles/styles'
import styled from 'styled-components'
import EditGroupComponents, { Validation } from '../components/EditGroupComponents'
import GroupItem from '../components/NewLayout/GroupItem'

const CreateGroup = () => {
  const request = useRequest()
  const { id, token } = useParams<{ id: string; token: string }>()

  const [group, setGroup] = useState<Omit<Group, 'id'>>({
    name: '',
    location_name: '',
    link_facebook: '',
    location_coord: {
      lat: 0,
      lng: 0,
    },
  })

  const history = useHistory()
  const [sucessModal, setSuccessModal] = useState(false)
  const [ready, setReady] = useState(false)
  const [validation, setValidation] = useState<(keyof Validation)[]>([])
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    request(`/group/get?id=${id}`).then((grp) => setGroup((x) => ({ ...x, ...grp })))
  }, [id, request])
  console.log(group)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    if (!ready) return

    request(`/group/update?token=${token}`, {
      method: 'POST',
      body: JSON.stringify(group),
    })
      .then((x) => {
        console.log(x)
        setSuccessModal(true)
        return new Promise((res) => setTimeout(res, 6000))
      })
      .then(() => history.replace('/'))
  }

  return (
    <EditPage>
      <div className="main">
        <CenterAlign>
          {sucessModal ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#28a745' }}>
              <h3>Thanks for submitting your group</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <EditGroupComponents
                omitKeys={['emails']}
                onChange={(group, validation) => {
                  setValidation(validation)
                  setGroup(group)
                  console.log(group, validation)
                  validation.length === 0 ? setReady(true) : setReady(false)
                }}
                group={group}
                validation={validation}
              />

              <div
                style={{ display: submitted && validation.length > 0 ? 'block' : 'none' }}
                className="validation"
              >
                <label style={{ display: 'block', margin: '1.2rem 0 0.4rem 0' }}>
                  Please complete
                </label>
                {validation.map((key) => (
                  <span style={{ color: 'rgba(255, 0, 0, 0.6)', margin: '0 0.2rem' }}>
                    {key === 'link_facebook' ? 'link' : key === 'location_name' ? 'location' : key}
                  </span>
                ))}
              </div>

              <FormButtons>
                <Link to="/">
                  <button className="btn-secondary" type="button">
                    cancel
                  </button>
                </Link>
                <button type="submit">submit</button>
              </FormButtons>
            </form>
          )}
        </CenterAlign>
      </div>
      <div className="preview">
        <CenterAlign>
          <div className="item">
            <GroupItem
              onSelect={() => null}
              selected={false}
              group={{ ...group, id: '1234567890' }}
              disableDropdown={true}
            />
          </div>
        </CenterAlign>
      </div>
    </EditPage>
  )
}

export default CreateGroup

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem 0;

  button {
    margin: 0 0.4rem;
  }
`