import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { SWRConfig } from 'swr';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SWRConfig value={{ revalidateOnFocus: false, errorRetryCount: 5 }}>
          <App />
        </SWRConfig>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorker.unregister();
