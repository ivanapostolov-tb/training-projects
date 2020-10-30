import React from 'react';
import './Sort.css';

class Sort extends React.Component {
    constructor(props) {
        super(props);

        this.state = { sortBy: "React" };

        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(event) {
        this.props.callback(event.target.value);
    }

    render() {
        return (
            <div className="sort">
                <div className="sort__title">Sort By</div>
                <div className="sort__options" onChange={this.onChangeValue}>
                    <div>
                        <input type="radio" value="price__upwards" name="sort" />
                        <label>Price upwards</label>
                    </div>
                    <div>
                        <input type="radio" value="price__downwards" name="sort" />
                        <label>Price downwards</label>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sort;