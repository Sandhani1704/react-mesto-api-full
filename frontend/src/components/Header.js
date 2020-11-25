import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import headerLogo from '../images/logo.png';


function Header({ loggedIn, loggedOut, email }) {

    const path = useLocation().pathname;

    return (

        <header className="header">
            <img className="header__logo" src={headerLogo} alt="Логотип Mestro" />
            {loggedIn ? <div className="header__info">
                <p className="header__email">{email}</p>
                <button className="header__logout-button" onClick={loggedOut}>Выйти</button>
            </div> :
                <Link className="header__link" to={(path === '/signup') ? '/signin' : '/signup'}>
                    {(path === '/signup') ? 'Войти' : 'Регистрация'}
                </Link>}
        </header>


    );
}

export default Header;