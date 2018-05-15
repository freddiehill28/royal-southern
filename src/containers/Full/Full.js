import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Dashboard from '../../views/Dashboard/';

// Purchase Orders
import NewOrder from '../../views/PurchaseOrders/NewOrder';
import SearchOrder from '../../views/PurchaseOrders/SearchOrder';
import MyOrders from "../../views/PurchaseOrders/MyOrders";
import ViewSingleOrder from "../../views/PurchaseOrders/ViewSingleOrder";

class Full extends Component {
  render() {
    return (
      <div className="app">
        <Header/>
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb/>
            <Container fluid>
              <Switch>
                <Route path="/dashboard" name="Dashboard" component={Dashboard}/>
                <Route path="/purchase-order/mine" name="My Orders" component={MyOrders}/>
                <Route path="/purchase-order/new" name="New Purchase Order" component={NewOrder}/>
                <Route path="/purchase-order/find" name="Find Purchase Order" component={SearchOrder}/>

                <Route exact path="/purchase-order/:uid/:origin" name="View Purchase Order" component={ViewSingleOrder}/>

                <Redirect from="/" to="/dashboard"/>
              </Switch>
            </Container>
          </main>
          <Aside/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default Full;
