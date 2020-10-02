import React from 'react'

// Sort function to show highest scores first
const compare = (x, y) => {
  if (x.points > y.points) return -1
  if (x.points < y.points) return 1

  return 0
}

export default function Scores(props) {
  const { roomname, scores } = props

  return <div className="team-landing">
    <div className="score-panel">
      <h2>Quiz closed!</h2>
      <p className="sub">"{roomname}"</p>
      <ol className="scores">
        {scores.sort(compare).map((s, i) => {
          return i <= 3 ? <li>
            <p className="score-name">{s.name}</p>
            <p className="score-score">{s.points} points</p>
          </li> : null
        })}
      </ol>
    </div>
  </div>
}