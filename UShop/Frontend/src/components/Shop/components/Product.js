import React from 'react';
import './Product.css';
import { Link } from 'react-router-dom'

class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link to={"/product/" + this.props.id} className="product">
                <div className="product__wrapper" style={{ backgroundImage: `url(${this.props.imageUrl})` }}>
                    <img className="product__image" src={this.props.imageUrl} />
                    <button className="product__buttonAdd">+</button>
                </div>
                <div className="product__name">
                    {this.props.name}
                </div>
                <div className="product__price">
                    ${this.props.price}
                </div>
            </Link>
        );
    }
}

export default Product;