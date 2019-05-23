import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss';

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">
            <NavLink to="/">
                <h1>UN-SDGS-Content-Linking</h1>
            </NavLink>
        </div>
        <nav className="main-nav-item">
            <ul>
                <li><NavLink to="/">Upload</NavLink></li>
            </ul>
        </nav>
    </header>

);


export default mainNavigation;