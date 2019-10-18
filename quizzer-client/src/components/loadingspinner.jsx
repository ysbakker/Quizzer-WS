import React from 'react'

export default function LoadingSpinner(props) {
  return <div className="loading-container">
    <img src="img/loading.svg" alt="loading..." />
    <p>{props.text}</p>
  </div>
}