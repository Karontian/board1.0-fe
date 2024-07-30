import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Modal from 'react-modal';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Set the app element for MODAL
Modal.setAppElement('#root'); // Ensure this matches the root element ID in your index.html


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
