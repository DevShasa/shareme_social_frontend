import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from "./reduxStore/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_TOKEN}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);
