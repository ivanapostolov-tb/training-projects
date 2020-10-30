import React from 'react';
import './CategoryPin.css';
import { Link } from 'react-router-dom'

class CategoryPin extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.callback(this.props.id);
    }

    render() {
        return (
            <Link to={`/shop/${this.props.id}`} className="category" onClick={this.handleClick}>
                <div className="category__wrapper" style={{ backgroundImage: `url(${this.props.imageUrl})` }}>
                    <img className="category__image" src={this.props.imageUrl} alt="Category" />
                </div>
                <span href="category.html">{this.props.name}</span>
            </Link>
        );
    }
}

export default CategoryPin;