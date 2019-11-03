import React from 'react'

export default function InfoPanel(props) {
  const { roomname, round, question } = props
  return <div className="panel info-panel">
    <p className="room-name"><strong>"{roomname}"</strong></p>
    {round && round !== 0 ? <p className="info-item">Round <span className="tomato-highlight">{round}</span></p> : null}
    {question && question !== 0 ? <p className="info-item">Question <span className="tomato-highlight">{question}</span></p> : null}
  </div>
}