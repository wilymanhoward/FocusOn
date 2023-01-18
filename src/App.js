import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './pages/Main';
import Login from './pages/Login';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/dashboard" component={Main}/>
  
    </Switch>
    
  );
}

export default App;
