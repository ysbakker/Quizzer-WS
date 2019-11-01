import React from 'react'

export default function TopPanel(props) {
  const { roomid } = props
  return <div className="top-panel">
    <p className="room-id">Room <strong>{roomid}</strong></p>
  </div>
}