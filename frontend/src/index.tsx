import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppThemeProvider } from './theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);