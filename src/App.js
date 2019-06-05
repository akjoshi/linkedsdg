import React from 'react';
import Upload from './pages/Upload/Upload';
import Home from './pages/Home/Home';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainNavigation from './components/MainNavigation/MainNavigation';
import MainContext from './context/main-context'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
      <MainContext.Provider value={{
            waitForData: true
          }}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/upload" component={Upload} />
          </Switch>
        </main>
        </MainContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
