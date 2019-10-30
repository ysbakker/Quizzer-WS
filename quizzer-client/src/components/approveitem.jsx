import React from 'react'

export default function ApproveItem(props) {
  const { item, acceptTeamHandler, denyTeamHandler } = props

  return <li className="item-approve">
    <p>{item.text}</p>
    <div>
      <button
        onClick={() => acceptTeamHandler(item.id)}
      >
        <img src="/img/check.svg" alt="checkmark icon" />
      </button>
      <button
        onClick={() => denyTeamHandler(item.id)}
      >
        <img src="/img/cross.svg" alt="cross icon" />
      </button>
    </div>
  </li>
} 