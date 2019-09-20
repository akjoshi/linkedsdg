import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss'; 

const mainNavigation = props => (
    <header className="main-nav">
        <div className="main-nav-logo">

        </div>
        <div className="nav-title">
            <NavLink to="/">
                <h2>SUSTAINABLE DEVELOPMENT LINKS</h2>
            </NavLink>
        </div>
    </header>
);


export default mainNavigation;