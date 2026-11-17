import React from 'react'
import './TransitionLoader.css'

export default function TransitionLoader({ message = 'Memuat dashboard SIPRESTASI...' }) {
  return (
    <div className="transition-loader-overlay">
      <div className="transition-loader-content">
        <div className="transition-spinner" />
        <p className="transition-loader-text">{message}</p>
      </div>
    </div>
  )
}
