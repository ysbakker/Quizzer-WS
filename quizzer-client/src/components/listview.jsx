import React from 'react'

export default function ListView(ListItemComponent) {
  // ListItemComponent wrapped in ListView
  return function WrappedListView(props) {
    const { title, items, selectedIds, handlers } = props

    return <ul className="list-container">
      <h1>{title}</h1>
      {items.map(i => <ListItemComponent
        key={i.id}
        item={i}
        handlers={handlers}
        selected={selectedIds ? selectedIds.includes(i.id) : false}
      />)}
      {items.length === 0 ? <p className="empty-list">Waiting...</p> : null}
    </ul>
  }
}