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
        <nav className="main-nav-item">
            <ul>
                <li><NavLink to="/">Upload</NavLink></li>
            </ul>
        </nav>
    </header>

);


export default mainNavigation;