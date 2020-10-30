import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from '../Header/Header';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import Basket from '../Basket/Checkout';
import SignForm from '../SignForm/SignForm';
import AdminView from '../AdminView/AdminView';
import Shop from '../Shop/Shop';
import Product from '../Product/Product';
import Checkout from '../Checkout/Checkout';

class comp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Header />
        <Product id={this.props} />
        <Footer />
      </div>
    );
  }
}

function App() {
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path='/basket'>
            <Header />
            <Basket />
            <Footer />
          </Route>
          <Route path='/checkout'>
            <Header />
            <Checkout />
            <Footer />
          </Route>
          <Route path="/sign-in">
            <SignForm />
            <Footer />
          </Route>
          <Route path="/sign-up">
            <SignForm />
            <Footer />
          </Route>
          <Route path="/admin">
            <AdminView />
          </Route>
          <Route path="/shop/:categoryid" component={params => <div className="app"><Header /><Shop id={params.match.params.categoryid} /><Footer /></div>}>
          </Route>
          <Route path="/product/:id" component={params => <div className="app"><Header /><Product id={params.match.params.id} /><Footer /></div>}>
          </Route>
          <Route path="/">
            <Header />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
