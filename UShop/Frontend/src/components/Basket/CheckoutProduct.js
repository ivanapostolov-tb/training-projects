import React from 'react';
import './CheckoutProduct.css'
import { StateContext } from '../StateProvider';
import { Link } from 'react-router-dom';

class CheckoutProduct extends React.Component {
    constructor(props) {
        super(props);

        this.removeFromBasket = this.removeFromBasket.bind(this);
    }

    static contextType = StateContext;

    removeFromBasket() {
        const dispatch = this.context[1];

        dispatch({
            type: "REMOVE_FROM_BASKET",
            id: this.props.id,
            variation: this.props.variation
        });
    }

    render() {
        return (
            <div className="checkoutProduct">
                <div className="checkoutProduct__imageWrapper" style={{ backgroundImage: `url(${this.props.imageUrl})` }}>
                    <img className="checkoutProduct__image" src={this.props.imageUrl} alt="Product" />
                </div>
                <div className="checkoutProduct__info">
                    <Link to={`/product/${this.props.id}`} className="checkoutProduct__infoTitle">{this.props.name}</Link>
                    <div className="checkoutProduct__infoVvariation">{this.props.variation}</div>
                    <div className="checkoutProduct__infoPrice">{this.props.quantity} x ${this.props.price} = <span>{Math.round(this.props.quantity * this.props.price * 100) / 100}</span></div>
                </div>
                <button className="checkoutProduct__actionRemove" onClick={this.removeFromBasket}>&times;</button>
            </div>
        );
    }
}

export default CheckoutProduct