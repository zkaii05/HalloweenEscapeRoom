import React from 'react';
import './ImageCell.css';

const ImageCell = ({ label, src, boxes, clickedBoxes, onBoxClick, indicators }) => {
  return (
    <div className="image-cell">
      <div 
        className="image-wrapper"
        onClick={() => onBoxClick('wrong')} // wrong click on background
      >
        <img src={src} alt={label} className="game-image" />
        {boxes.map((box) => (
          <div
            key={box.id}
            className={`click-box ${clickedBoxes.includes(box.id) ? 'clicked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onBoxClick(box.id, { top: box.top, left: box.left });
            }}
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
          />
        ))}
      </div>
      {indicators.map(ind => (
        <div
          key={ind.id}
          className="floating-indicator"
          style={{
            position: 'absolute',
            top: `${ind.top}px`,
            left: `${ind.left}px`,
            color: ind.color,
            fontSize: '20px',
            fontWeight: 'bold',
            animation: 'floatUp 1.2s ease-out',
            pointerEvents: 'none',
            zIndex: 1000, // Ensure it's above everything
          }}
        >
          {ind.text}
        </div>
      ))}
    </div>
  );
};

export default ImageCell;
