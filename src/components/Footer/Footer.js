import React from 'react';
import './Footer.scss';
import logo from './logo.png';

import sdgLogo from './sdglogo.jpg';

const Footer = props => (
    <footer className="main-footer">
        <div className="logo-container">
            <p className="describe">Delivered by</p>
            <a href=" http://epistemik.co">
                <img src={logo} alt="Epistemik"></img>
            </a>
            <a href="http://www.sdg.org/">
                <img src={sdgLogo} alt="SDG logo"></img>
            </a>
        </div>
    </footer>
);


export default Footer;