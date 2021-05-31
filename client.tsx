import React from 'react';
import { render } from 'react-dom';
import SWRDevtools from '@jjordy/swr-devtools'
import App from '@layouts/App';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {cache, mutate} from 'swr';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';
console.log("env", process.env.NODE_ENV === 'production');
render(
  <BrowserRouter>
  <>
   <SWRDevtools cache={cache} mutate={mutate} />
      <App />
  </>
  </BrowserRouter>,
  document.querySelector('#app'),
);
