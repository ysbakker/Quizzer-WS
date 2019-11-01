import React from 'react'

export default function ListView(props) {
  const { ListItemComponent, title, items } = props

  return <ul className="list-container">
    <h1>{title}</h1>
    {items.map(i => <ListItemComponent key={i.id} item={i} />)}
    {items.length === 0 ? <p className="empty-list">Waiting...</p> : null}
  </ul>
}