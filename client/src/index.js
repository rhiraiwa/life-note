import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './index.scss';
import MFDataProvider from './context/MasterFileContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MFDataProvider>
        <App />
      </MFDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);