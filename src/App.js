import React from 'react';
import Upload from './pages/Upload'
import {BrowserRouter} from 'react-router-dom';
import MainNavigation from './components/MainNavigation/MainNavigation';

import './App.scss'

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Upload></Upload>
        </main>

      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
