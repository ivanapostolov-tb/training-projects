import React from 'react';
import './Checkout.css';
import PaypalButtons from "./components/PaypalButton";
import { StateContext } from '../StateProvider';

class Checkout extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = StateContext;

    render() {
        return (
            <div className="checkout">
                <PaypalButtons />
            </div>
        );
    }
}

export default Checkout;