// src/App.jsx
import React, { useState } from 'react';
import ImageCell from './components/ImageCell';
import './App.css';

const baseBoxes = [
  { id: 1, top: '41%', left: '9%', width: '6%', height: '11%' },
  { id: 2, top: '35%', left: '33%', width: '20%', height: '14%' },
  { id: 3, top: '44%', left: '52%', width: '5%', height: '9%' },
  { id: 4, top: '49%', left: '74%', width: '20%', height: '14%' },
  { id: 5, top: '85%', left: '38%', width: '10%', height: '14%' },
  { id: 6, top: '77%', left: '4%', width: '6%', height: '9%' },
  { id: 7, top: '62.5%', left: '16%', width: '5%', height: '10%' },
  { id: 8, top: '86%', left: '69%', width: '6%', height: '9%' },
  { id: 9, top: '18%', left: '48%', width: '5%', height: '7%' },
];

function App() {
  const [clickedBoxes, setClickedBoxes] = useState([]);

  const handleBoxClick = (id) => {
    if (!clickedBoxes.includes(id)) {
      setClickedBoxes([...clickedBoxes, id]);
    }
  };

  return (
    <div className="container">
      <div className="top-row">
        <ImageCell
          label="Left Image"
          src="/image-left.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
        />
        <ImageCell
          label="Right Image"
          src="/image-right.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
        />
      </div>
      <div className="bottom-row">
        <p>{clickedBoxes.length} / 9 differences found</p>
      </div>
    </div>
  );
}

export default App;