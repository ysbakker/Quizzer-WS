import React from 'react'
import { Link } from 'react-router-dom'

export default function Logo() {
  return <Link to="/" className="bare-link">
    <h1 className="logo-text">Quizzer</h1>
  </Link>
}