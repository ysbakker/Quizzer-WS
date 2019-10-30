import React from 'react'

export default function ListView(props) {
  const { title, ListItemComponent, items } = props

  return <ul className="list-container">
    <h1>{title}</h1>
    {items.map(i => <ListItemComponent key={i.id} item={i} />)}
  </ul>
}