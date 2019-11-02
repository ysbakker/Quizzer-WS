import React from 'react'

export default function ApproveItem(props) {
  const { item, handlers } = props

  return <li className="list-view-item item-approve">
    <p>{item.text}</p>
    <div>
      <button
        onClick={() => handlers.acceptHandler(item.id)}
      >
        <img src="/img/check.svg" alt="checkmark icon" />
      </button>
      <button
        onClick={() => handlers.denyHandler(item.id)}
      >
        <img src="/img/cross.svg" alt="cross icon" />
      </button>
    </div>
  </li>
} 