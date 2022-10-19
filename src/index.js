import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CookieBanner from './App';
import reportWebVitals from './reportWebVitals';

const LOCAL_DEV = true; // TODO should also be moved to some central env file
const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('cookie-root'));
  root.render(
    <React.StrictMode>
    </React.StrictMode>,
  );
};

if (LOCAL_DEV) {
  renderApp();
} else {
  // Window function registered to be called from inside a django view
  window.renderApp = renderApp;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
