import React from 'react'

export default function InfoPanel(props) {
  const { roomname } = props
  return <div className="panel info-panel">
    <p className="room-name"><strong>"{roomname}"</strong></p>
  </div>
}