import React from 'react';
import './Filter.css';
import { StateContext } from '../../StateProvider';

class CheckBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = { checked: false };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        this.props.callback({ active: !this.state.checked, option: this.props.option });

        this.setState({ checked: !this.state.checked });
    }

    render() {
        return (
            <div className="checkbox">
                <input type="checkbox" onChange={this.handleChange} checked={this.state.checked} />
                <span>{this.props.option}</span>
            </div>
        );
    }
}

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
    }

    static contextType = StateContext;

    updateFilter(filter) {
        this.props.callback({ name: this.props.name, option: filter.option, active: filter.active });
    }

    render() {
        return (
            <div className="filter">
                <div className="filter__title">{this.props.name}</div>
                <div className="filter__content">
                    {this.props.options.map((e, i) => <CheckBox key={i} callback={this.updateFilter} option={e} />)}
                </div>
            </div>
        );
    }
}

export default Filter;