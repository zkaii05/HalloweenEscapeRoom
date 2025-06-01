import React from 'react';
import ReactDOM from 'react-dom/client';
import ImageCell from './components/ImageCell';
import RecordsPanel from './components/RecordsPanel';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
