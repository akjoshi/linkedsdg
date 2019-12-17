import React from 'react';
import Upload from './pages/Upload/Upload'; 
import About from './pages/About/About'; 
import { HashRouter, Route, Switch } from 'react-router-dom';
import MainNavigation from './components/MainNavigation/MainNavigation';
import Footer from './components/Footer/Footer'

// import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';



function App() {
  return (
    <HashRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Route path="/" component={Upload} exact />
            <Route path="/about" component={About} />
          </Switch>
        </main>
        <Footer />
      </React.Fragment>
    </HashRouter>
  );
}

export default App;
