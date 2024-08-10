import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userReducer from './features/user';
import modalReducer from './features/modal';
import cardReducer from './features/card';
import groupsReducer from './features/groups';
import eventsReducer from './features/events';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { loadState, saveState } from './features/localStorageUtil';

const persistedState = {
  user: loadState('user'),
  groups: loadState('groups'),  
  // events: loadState('events'),
};


const store = configureStore({
  reducer: {user: userReducer, modal: modalReducer, card: cardReducer, groups: groupsReducer, events: eventsReducer},
  preloadedState: persistedState

});

store.subscribe(() => {
  const state = store.getState();
  saveState('user', state.user);
  saveState('groups', state.groups);
  // saveState('events',state.events);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
