import React from 'react';
import './Footer.scss';
import logo from './logo.png';

import sdgLogo from './sdglogo.jpg';

const Footer = props => (
    <footer className="main-footer">
        <div className="logo-container">
            <p className="describe">Delivered by</p>
              <a href="https://www.un.org/development/desa/">
                <img src={logo} alt="UN DESA"></img>
                </a>
            <a href="http://www.sdg.org/">
                <img src={sdgLogo} alt="SDG logo"></img>
            </a>
        </div>
    </footer>
);


export default Footer;