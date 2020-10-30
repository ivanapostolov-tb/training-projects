import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useStateValue } from '../StateProvider';

function Header() {
    const [state] = useStateValue();

    const toggleMenu = () => {
        let x = document.getElementById("header");
        if (x.className === "header") {
            x.className += " responsive";
        } else {
            x.className = "header";
        }
    }

    return (
        <nav id="header" className="header">
            <div className="header__links">
                <Link to="/">Home</Link>
                <Link to="/basket">Basket <span class="badge badge-light badge-pill">{state.basket?.length}</span></Link>
                {
                    state.user ? <Link to="/sign-in">Logout</Link> : <Link to="/sign-in">Sign in</Link>
                }
            </div>
            <div className="header__search">
                <input type="text" placeholder="Search..." />
                <button className="header__menuButton" onClick={toggleMenu}>Menu</button>
            </div>
        </nav>
    );
}

/*class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = { isNavCollapsed: true }
    }

    render() {
        const handleNavCollapse = () => this.setState({ isNavCollapsed: !this.state.isNavCollapsed });

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

                <a class="navbar-brand" href="javascript:void(0)">Logo</a>
                <button class="navbar-toggler navbar-toggler-right collapsed" type="button" data-toggle="collapse" data-target="#navb" aria-expanded={!this.state.isNavCollapsed ? true : false} onClick={handleNavCollapse}>
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class={`${this.state.isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navb">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:void(0)">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:void(0)">Link</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="javascript:void(0)">Disabled</a>
                        </li>
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        <input class="form-control mr-sm-2" type="text" placeholder="Search" />
                        <button class="btn btn-success my-2 my-sm-0" type="button">Search</button>
                    </form>
                </div>
            </nav>
        );
    }
}*/

export default Header;