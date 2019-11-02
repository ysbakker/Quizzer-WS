import React from 'react'

export default function SelectItem(props) {
  const { item, selected, handlers } = props

  return <li
    onClick={() => {
      if (selected) handlers.onDeselectHandler(item.id)
      else handlers.onSelectHandler(item.id)
    }}
    className={`list-view-item item-select${selected ? ' selected' : ''}`}>
    <p>{item.text}</p>
  </li>
} 