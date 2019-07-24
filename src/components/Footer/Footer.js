import React from 'react';
import './Footer.scss';
import logo from './logo.png';

const Footer = props => (
    <footer className="main-footer">
        <div className="logo-container">
            <p className="describe">Powered by</p>
            <a href=" http://epistemik.co">
                <img src={logo} alt="Epistemik"></img>
            </a>
        </div>
    </footer>
);


export default Footer;