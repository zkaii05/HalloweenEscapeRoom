// src/components/FloatingIndicator.jsx
import React from 'react';
import './FloatingIndicator.css';

function FloatingIndicator({ text, color, id }) {
  return (
    <div className={`floating-indicator ${color}`} key={id}>
      {text}
    </div>
  );
}

export default FloatingIndicator;