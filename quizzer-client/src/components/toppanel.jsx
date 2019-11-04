import React from 'react'

export default function TopPanel(props) {
  const { roomid, question } = props
  return <div className="top-panel">
    <p className="room-id">Room <strong>{roomid}</strong></p>
    {question && question.question ? <p><strong><span className="tomato-highlight">Q</span> {question.question}</strong></p> : null}
    {question && question.answer ? <p><strong><span className="tomato-highlight">A</span> {question.answer}</strong></p> : null}
  </div>
}