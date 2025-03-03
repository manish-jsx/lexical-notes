import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { EditorProvider } from './EditorInstance';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EditorProvider>
      <App />
    </EditorProvider>
  </React.StrictMode>
);
