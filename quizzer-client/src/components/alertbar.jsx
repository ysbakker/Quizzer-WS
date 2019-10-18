import React from 'react'

export default function AlertBar(props) {
  return <div className={`alert-bar ${props.success ? 'success' : 'error'}`}>
    <p>{props.message}</p>
  </div>
}

export function setError(message) {
  const el = document.querySelector('.alert-bar')
  el.classList.remove('success')
  el.classList.add('error')
  el.innerHTML = `<p>Error: ${message}</p>`
}

export function setSuccess(message) {
  const el = document.querySelector('.alert-bar')
  el.classList.add('success')
  el.classList.remove('error')
  el.innerHTML = `<p>${message}</p>`
}

export function showAlertBar(duration = 0) {
  function hideAlertBar() {
    el.classList.remove('show')
  }

  const el = document.querySelector('.alert-bar')
  el.classList.add('show')

  if (duration != 0) setTimeout(() => {
    hideAlertBar()
  }, duration)
}