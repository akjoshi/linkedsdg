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
        {/* <div className="main-nav-logo">
            <a href="https://www.un.org/sustainabledevelopment/sustainable-development-goals/">
                <img src={logo} alt="Upload"></img>
            </a>
        </div> */}
        {/* <div className="nav-title">
            <NavLink to="/">
                <h2>SUSTAINABLE DEVELOPMENT LINKS</h2>
            </NavLink>
        </div> */}
    </footer>
);


export default Footer;