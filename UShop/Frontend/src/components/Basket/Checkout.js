import React from 'react';
import './Checkout.css';
import { StateContext } from '../StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link } from 'react-router-dom';

class Checkout extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = StateContext;

    render() {
        const total = Math.round(this.context[0].basket.reduce((a, b) => a += Math.round(b.quantity * b.price * 100) / 100, 0) * 100) / 100;

        return (
            <div className="checkout__basket" >
                <div className="checkoutProducts">
                    {this.context[0].basket?.map((item, index) => (
                        <CheckoutProduct
                            key={index}
                            id={item.id}
                            name={item.name}
                            imageUrl={item.imageUrl}
                            price={item.price}
                            quantity={item.quantity}
                            variation={item.variation}
                        />
                    ))}
                </div>

                { this.context[0].basket.length > 0 ? <h1 class="checkout__total">Total: <span><Link to={`/${this.context[0].user === null ? 'sign-in' : 'checkout'}`}>Checkout</Link>${total}</span></h1> : <h1>Basket is empty</h1>}
            </div >
        );
    }
}

export default Checkout;