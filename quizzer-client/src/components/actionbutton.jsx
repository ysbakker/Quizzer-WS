import React from 'react'

/**
 * ActionButton actually renders a container with 1 or more buttons,
 * stored in props.buttons:
 * { text, clickHandler }
 */
export default function ActionButton(props) {
  const { buttons } = props
  return <div className="action-buttons">
    {buttons.map(button => (
      <button
        onClick={() => button.clickHandler()}
      >
        {button.text}
      </button>
    ))}
  </div>
}