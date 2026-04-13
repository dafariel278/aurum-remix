import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill global for libraries that expect it, using Object.create(window)
// to allow shadowing of read-only properties like 'fetch'.
if (typeof (window as any).global === 'undefined') {
  (window as any).global = Object.create(window);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
