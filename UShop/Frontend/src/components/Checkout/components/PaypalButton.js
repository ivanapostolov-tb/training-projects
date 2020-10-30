import React from "react";
import ReactDOM from "react-dom";
import scriptLoader from "react-async-script-loader";
import "./PaypalView.css";
import { StateContext } from '../../StateProvider';

const CLIENT_ID = 'AYP-QDnfmbFb2T5zJr6XDAsmgGsXThSotVdc1b7jXGXGwCBca7d_JthOmgwnXo4vGBABgrKTTmj95s7c'

let PayPalButton = null;

class PaypalButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = { status: 'loading', total: 0 };

        window.React = React;
        window.ReactDOM = ReactDOM;
    }

    static contextType = StateContext;

    componentDidMount() {
        const { isScriptLoaded, isScriptLoadSucceed } = this.props;

        if (isScriptLoaded && isScriptLoadSucceed) {
            PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

            this.setState({ status: 'loaded' });
        }

        this.setState({ total: Math.round(this.context[0].basket.reduce((a, b) => a += Math.round(b.quantity * b.price * 100) / 100, 0) * 100) / 100 })
    }

    componentWillReceiveProps(nextProps) {
        const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

        const scriptJustLoaded = !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

        if (scriptJustLoaded) {
            if (isScriptLoadSucceed) {
                PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

                this.setState({ status: 'loaded' });
            }
        }
    }

    createOrder(data, actions) {
        if (this.state.total > 0) {
            return actions.order.create({
                purchase_units: [
                    { description: +"Clothes", amount: { currency_code: "USD", value: this.state.total } }
                ]
            });
        }
    };

    onApprove(data, actions) {
        actions.order.capture().then(details => {
            const orderDetails = {
                total: details.purchase_units[0].amount.value,
                time: details.create_time,
                shipping: details.purchase_units[0].shipping
            }

            this.registerOrder(orderDetails);

            this.setState({ status: 'paid' });
        });
    };

    async registerOrder(details) {
        const url = `${this.context[0].baseUrl}api/order/`;

        const body = {
            token: this.context[0].user.accessToken,
            products: this.context[0].basket,
            details: details
        }

        console.log(body);

        const parameters = {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
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

    render() {
        const { status } = this.state;

        if (status === 'paid') {
            return (
                <div className="main">
                    <h2>
                        Your order is paid
                    </h2>
                </div>
            );
        } else if (status === 'loaded') {
            return (
                <div>
                    <h2>Total checkout Amount ${this.state.total}</h2>

                    <PayPalButton
                        createOrder={(data, actions) => this.createOrder(data, actions)}
                        onApprove={(data, actions) => this.onApprove(data, actions)}
                    />
                </div>
            );
        } else {
            return (
                <div class="loader" />
            );
        }
    }
}

export default scriptLoader(`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=USD`)(PaypalButton);