import React from 'react';
import './ImageCell.css';

const ImageCell = ({ label, src, boxes, clickedBoxes, onBoxClick }) => {
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
            style={{
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
            }}
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering wrong click
              onBoxClick(box.id);  // correct click
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCell;
