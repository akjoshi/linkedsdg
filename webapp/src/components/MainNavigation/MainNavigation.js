import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss'; 

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">

        </div>
        <div className="nav-title">
            <NavLink to="/">
                <h2>LinkedSDG</h2>
            </NavLink>
            <NavLink to="/about">
                <h2>About</h2>
            </NavLink> 
            <NavLink to="/api">
                <h2>API</h2>
            </NavLink>
        </div>
    </header>
);


export default mainNavigation;