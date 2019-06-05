import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.scss';
import logo from './logo.jpg';
import MainContext from '../../context/main-context'

const mainNavigation = props => (
    <MainContext.Consumer>
        {(context) => {
            return (
                <header className="main-nav">
                    <div className="main-nav-logo">
                        <NavLink to="/">
                            <img src={logo} alt="Upload"></img>
                        </NavLink>
                    </div>
                    <nav className="main-nav-item">
                        <ul>
                            <li><NavLink to="/upload" onClick={(e) => {context.waitForData = true}}>Upload</NavLink></li>
                        </ul>
                    </nav>
                </header>
            )
        }}
    </MainContext.Consumer>


);


export default mainNavigation;