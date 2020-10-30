import React from 'react';
import './Shop.css';
import Product from './components/Product';
import { StateContext } from '../StateProvider';
import Filter from './components/Filter';
import Sort from './components/Sort';

class Shop extends React.Component {
    constructor(props) {
        super(props);

        this.state = { categoryid: '', products: [], availableFilters: {}, appliedFilters: {}, toggleFilter: false, toggleSort: false };

        this.updateProducts = this.updateProducts.bind(this);

        this.toggle = this.toggle.bind(this);

        this.sort = this.sort.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        this.request('products');

        this.request('filters');
    }

    fetch(url, prop) {
        const params = {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        };

        fetch(url, params).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ [prop]: data.error ? [] : data });
        }).catch(err => {
            console.log(err);
        });
    }

    request(resource) {
        switch (resource) {
            case 'products':
                this.fetch(`${this.context[0].baseUrl}api/products/${btoa(JSON.stringify({ categoryId: this.props.id, filters: this.state.appliedFilters }))}`, 'products');
                break;
            case 'filters':
                this.fetch(`${this.context[0].baseUrl}api/filters/${this.props.id}`, 'availableFilters');
                break;
            default:
                break;
        }
    }

    updateProducts(filter) {
        let update = this.state.appliedFilters;

        if (typeof this.state.appliedFilters[filter.name] === 'undefined') {
            update[filter.name] = [];
        }

        filter.active ? update[filter.name].push(filter.option) : update[filter.name].splice(update[filter.name].indexOf(filter.option), 1);

        if (update[filter.name].length === 0) {
            delete update[filter.name];
        }

        this.setState({ appliedFilters: update }, () => {
            this.request('products');
        });
    }

    toggle(e) {
        if (e.target.textContent === 'Sort') {
            this.setState({ toggleSort: !this.state.toggleSort, toggleFilter: false });
        } else {
            this.setState({ toggleSort: false, toggleFilter: !this.state.toggleFilter });
        }
    }

    sort(e) {
        console.log(e);
        switch (e) {
            case 'price__upwards':
                this.setState({ products: this.state.products.sort((a, b) => a.price > b.price) })
                break;
            case 'price__downwards':
                this.setState({ products: this.state.products.sort((a, b) => a.price < b.price) })
                break;
            default:
                break;
        }
    }

    render() {
        const filters = Object.keys(this.state.availableFilters).map((e, i) => <Filter key={i} callback={this.updateProducts} name={e} options={this.state.availableFilters[e]} />);

        const productsList = this.state.products ? this.state.products.map(e => <Product key={e.id} id={e.id} imageUrl={`${this.context[0].baseUrl}product${e.id}.png`} name={e.name} price={e.price} />) : '';

        return (
            <div className="shop">
                <div className="shop__contentModifiers">
                    <div className="contentModifiers__toggles">
                        <button className="contentModifiers__toggle" onClick={this.toggle}>Filters</button>
                        <button className="contentModifiers__toggle" onClick={this.toggle}>Sort</button>
                    </div>
                    <div className="contentModifiers__anchor">
                        <div className={`contentModifiers__dropdown ${this.state.toggleSort ? "" : 'hidden'}`}>
                            <Sort callback={this.sort} />
                        </div>
                    </div>
                    <div className="contentModifiers__anchor">
                        <div className={`contentModifiers__dropdown ${this.state.toggleFilter ? "" : 'hidden'}`}>
                            {filters}
                        </div>
                    </div>
                </div>
                <div className="shop__productsContainer">
                    {productsList}
                </div>
            </div>
        );
    }
}

export default Shop;