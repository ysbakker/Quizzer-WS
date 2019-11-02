import React from 'react'

export default function TeamsPanel(props) {
  const { teams } = props
  return <div className="panel teams-panel">
    <div className="team-amount"><p>{teams.length}</p></div>
    <h2>Teams</h2>
    <ul className="team-list">
      {teams.map(team => <li key={team._id}>{team.name}</li>)}
    </ul>
  </div>
}