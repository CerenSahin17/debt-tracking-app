import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './app/store.tsx';
import '../src/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
