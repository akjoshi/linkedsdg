import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss';
import logo from './logo.jpg';

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">
            <NavLink to="/">
                <img src={logo} alt="Upload"></img>
            </NavLink>
        </div>
        <div className="nav-title">
            <h2>SUSTAINABLE DEVELOPMENT LINKS</h2>
        </div>
    </header>
);


export default mainNavigation;