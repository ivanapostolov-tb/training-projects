import React from 'react'
import './Products.css';
import { StateContext } from '../../../StateProvider';

class ProductCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card shadow m-3" style={{ width: "200px" }}>
                <img className="card-img-top w-100" src={`http://localhost:8000/product${this.props.id}.png`} alt="Card image" />
                <div className="card-body">
                    <p className="card-text">{this.props.name}</p>
                    <div className="d-flex flex-row">
                        <button type="button" class="btn btn-info flex-fill">Edit</button>
                        <button type="button" class="btn btn-danger flex-fill">Delete</button>
                    </div>
                </div>
            </div>
        );
    }
}

class ProductsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = { products: [] };
    }

    static contextType = StateContext;

    componentDidMount() {
        const url = `${this.context[0].baseUrl}api/products`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ products: data });
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="d-flex flex-wrap justify-content-center w-100">
                {
                    this.state.products.map((e, i) => <ProductCard id={e.id} name={e.name} />)
                }
            </div>
        );
    }
}

export default ProductsView;