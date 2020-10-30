import React from 'react';
import './OrdersView.css';
import { StateContext } from '../../../StateProvider';

class OrdersViewRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.mail}</td>
                <td>{this.props.time}</td>
                <td>{this.props.status}</td>
                <td className="pr-5" style={{ textAlign: 'right' }}>${this.props.price}</td>
            </tr>
        );
    }
}

class OrdersView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { orders: [] };
    }

    static contextType = StateContext;

    componentDidMount() {
        const url = `${this.context[0].baseUrl}api/orders`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ orders: data });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const columns = ['ID', 'User Email', 'Timestamp', 'Status', 'Price'].map((e, i) => <th key={i}>{e}</th>);
        let rows = [];

        if (Array.isArray(this.state.orders)) {
            rows = this.state.orders.map((e, i) => <OrdersViewRow key={i} id={e.id} mail={e.useremail} time={e.details.time} status={e.status} price={e.details.total} />);
        }

        return (
            <div className="ordersView__container">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-dark">
                            <tr>{columns}</tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default OrdersView;