import React from 'react';
import './AdminView.css';
import CategoryPost from './components/CategoryPost';
import OrdersView from './components/Orders/OrdersView';
import { StateContext } from '../StateProvider';
import { Redirect } from 'react-router-dom';
import ProductsView from './components/Products/ProductsView';

class AdminView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { view: 'AdminView' };

        this.switchView = this.switchView.bind(this);

        this.submited = this.submited.bind(this);
    }

    static contextType = StateContext;

    submited() {
        this.setState({ view: 'AdminView' });
    }

    switchView() {
        const state = this.context[0];

        switch (this.state.view) {
            case "AdminView":
                return ''
            case "CategoryPost":
                return <CategoryPost baseUrl={state.baseUrl} token={state.user.accessToken} callback={this.submited} />
            case "Orders":
                return <OrdersView />
            case "Products":
                return <ProductsView />
            default: break;
        }
    }

    render() {
        if (this.context[0].user === null) {
            return <Redirect to='/sign-in' />
        } else {
            return (
                <div className="row admin h-100 m-0">
                    <nav className="col-sm-2 bg-dark no-float h-100 p-0">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div className="active admin__option bg-dark w-100" onClick={e => this.setState({ view: 'Orders' })}>Orders</div>
                            </li>
                            <li class="nav-item">
                                <div className="admin__option bg-dark w-100" onClick={e => this.setState({ view: 'CategoryPost' })}>Categories</div>
                            </li>
                            <li class="nav-item">
                                <div className="admin__option bg-dark w-100" onClick={e => this.setState({ view: 'Products' })}>Products</div>
                            </li>
                        </ul>
                    </nav>
                    <div className="col-sm-10 h-100 p-0">
                        <div className="admin__heading bg-dark">
                            {this.state.view}
                        </div>
                        <div className="w-100 admin__view">
                            {this.switchView()}
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default AdminView;