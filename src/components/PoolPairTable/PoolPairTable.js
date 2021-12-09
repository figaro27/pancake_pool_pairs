
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { sortAddress } from '../../utils'
const Styles = styled.div`
  padding: 1rem;

  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 80%;
    margin: auto;
  }
  
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    vertical-align: middle;
  }

  td div {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  tr:nth-child(even) {
    background-color: #dddddd;
  }
`

const PoolPairTable = ({ data }) => {

  const columns = [
    'LP Token Address',
    'Token0',
    'Token1',
    'Status'
  ]
  // Render the UI for your table
  return (
    <Styles>
      <table>
        <thead>
          <tr>
            {columns.map((column, idx) => (
              <th style={{textAlign:'center'}} key={idx}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((_data, key) => 
            _data && <tr key={key}>
              <td>
                <div>
                  {sortAddress(_data.lpToken)}
                </div>
              </td>
              <td>
                <div>
                  <img src={_data.token0Logo || ''} width="40px" height="40px" alt='' />
                  <span>{_data.token0Symbol || ''}</span>
                  <span>{sortAddress(_data.token0)}</span>
                </div>
              </td>
              <td>
                <div>
                  <img src={_data.token1Logo || ''} width="40px" height="40px" alt='' />
                  <span>{_data.token1Symbol || ''}</span>
                  <span>{sortAddress(_data.token1)}</span>
                  
                </div>
              </td>
              <td>
                <div>
                  <span>{_data.allocPoint == 0 ? 'Inactive': 'Active'}</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Styles>
  )
}

export default PoolPairTable