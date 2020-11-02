import React from 'react'
import './Products.css';
import { StateContext } from '../../../StateProvider';

class ProductVariation extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="form-group">
                <label for="pwd">Variation:</label>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter color" />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Enter size" />
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" placeholder="Enter quantity" />
                </div>
            </div>
        );
    }
}

class ProductForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { categories: [], categoryId: -1, image: '', name: {}, gender: '', material: '', brand: '', price: 0, variations: [], variationsCount: 0 };

        this.requestHandler = this.requestHandler.bind(this);

        this.selectCategory = this.selectCategory.bind(this);

        this.addVariation = this.addVariation.bind(this);
    }

    static contextType = StateContext;

    componentDidMount() {
        const url = `${this.context[0].baseUrl}api/categories`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ categories: data });
            this.setState({ categoryId: data[0].id });
        }).catch(err => {
            console.log(err);
        });
    }

    async requestHandler(e) {
        e.preventDefault()

        const url = `${this.context[0].baseUrl}api/product`;

        const product = JSON.stringify({
            categoryid: this.state.categoryId,
            name: this.state.name,
            gender: this.state.gender,
            material: this.state.material,
            brand: this.state.brand,
            price: this.state.price,
            variations: this.state.variations
        });

        console.log(this.img);

        const formData = new FormData();
        formData.append('img', this.state.image);
        formData.append('token', this.context[0].user.accessToken);
        formData.append('product', product);

        const parameters = {
            method: 'post',
            body: formData
        }

        try {
            const response = await fetch(url, parameters);

            if (response.status === 200) {
                return (await response.json());
            } else {
                throw new Error(`Status code ${response.status}`);
            }
        } catch (e) {
            throw new Error(e.message);
        }
    }

    selectCategory(e) {
        const _id = this.state.categories.filter(el => el.name === e.target.value)[0].id;
        console.log(_id);
        this.setState({ categoryId: _id });
    }

    addVariation(color, size) {
        this.setState({ variations: [...this.state.variations, { color, size }] });
    }

    render() {
        return (
            <div class="container">
                <h2>Product Form</h2>
                <form onSubmit={this.requestHandler}>
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} class="form-control" placeholder="Product name" />
                    </div>
                    <div class="form-group">
                        <input type="file" accept="image/*" onChange={e => this.setState({ image: e.target.files[0] }, () => console.log(this.state.image))} class="form-control-file border" />
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select onChange={this.selectCategory} class="form-control">
                            {
                                this.state.categories.map((e, i) => <option key={i}>{e.name}</option>)
                            }
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Gender:</label>
                        <input type="text" value={this.state.gender} onChange={e => this.setState({ gender: e.target.value })} class="form-control" placeholder="Enter gender" />
                    </div>
                    <div class="form-group">
                        <label>Material:</label>
                        <input type="text" value={this.state.material} onChange={e => this.setState({ material: e.target.value })} class="form-control" placeholder="Enter material" />
                    </div>
                    <div class="form-group">
                        <label>Brand:</label>
                        <input type="text" value={this.state.brand} onChange={e => this.setState({ brand: e.target.value })} class="form-control" placeholder="Enter brand" />
                    </div>
                    <div class="form-group">
                        <label>Price:</label>
                        <input type="text" value={this.state.price} onChange={e => this.setState({ price: e.target.value })} class="form-control" placeholder="Enter brand" />
                    </div>
                    <ProductVariation callback={this.addVariation} />
                    <div class="form-group">
                        <button type="button" class="btn btn-outline-primary">Add Variation</button>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

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

        this.state = { products: [], formView: false };
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
        if (this.state.formView) {
            return <ProductForm />
        }
        return (
            <div className="d-flex flex-wrap justify-content-center w-100">
                {
                    this.state.products.map((e, i) => <ProductCard id={e.id} name={e.name} />)
                }

                <div className="card shadow m-3 d-flex  justify-content-center align-items-center" style={{ width: "200px" }}>
                    <button type="button" class="btn btn-outline-primary rounded" onClick={() => this.setState({ formView: true })}>Add new item</button>
                </div>
            </div>
        );
    }
}

export default ProductsView;