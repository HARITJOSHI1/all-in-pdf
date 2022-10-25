import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './components/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import axios from 'axios';
import { SWRConfig } from 'swr';

const store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <Provider store={store}>
    <SWRConfig
      value={{
        fetcher: async (url: string, ...args) =>
          await axios.get(url, { withCredentials: true }),
      }}
    >
      <App />
    </SWRConfig>
  </Provider>,
  document.getElementById('root')
);
