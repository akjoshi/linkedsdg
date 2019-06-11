import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss';
import logo from './logo.jpg';

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">
            <a href="https://www.un.org/sustainabledevelopment/sustainable-development-goals/">
                <img src={logo} alt="Upload"></img>
            </a>
        </div>
        <div className="nav-title">
            <NavLink to="/">
                <h2>SUSTAINABLE DEVELOPMENT LINKS</h2>
            </NavLink>
        </div>
    </header>
);


export default mainNavigation;