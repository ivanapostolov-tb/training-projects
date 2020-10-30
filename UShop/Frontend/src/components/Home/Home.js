import React from 'react';
import './Home.css';
import Product from '../Product/Product';
import CategoryPin from './components/CategoryPin';
import { StateContext } from '../StateProvider';

/*{<Product
    id="0"
    name="Ball with other additional imformation"
    imageUrl="http://localhost:8000/shirt.png"
    price="15.99"
    amount="10"
/>*/

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = { pins: [] };
    }

    static contextType = StateContext;

    componentDidMount() {
        this.requestPins();
    }

    requestPins() {
        const url = `${this.context[0].baseUrl}api/categories`;

        fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then(response => {
            return response.json();
        }).then(data => {
            this.setState({ pins: data })
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        const handlePinClick = (id) => {
            const action = {
                type: 'ADD_FILTER',
                filter: { categoryid: id }
            }

            this.context[1](action);
        }

        const categoryPins = this.state.pins.map(e => <CategoryPin callback={handlePinClick} key={e.id} id={e.id} imageUrl={`${this.context[0].baseUrl}category${e.id}.png`} name={e.name} />);

        return (
            <div className="home">
                <div className="home__banner"><span>Ushop - the best shopping experience</span></div>

                <div className="home__categories">
                    {categoryPins}
                </div>
            </div>
        );
    }
}

export default Home;