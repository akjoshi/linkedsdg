import React from 'react';
import Upload from './pages/Upload'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import MainNavigation from './components/MainNavigation/MainNavigation';

import './App.scss'

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/upload" exact />
            <Route path="/upload" component={Upload} />
          </Switch>
        </main>

      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
