import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container, Popover, PopoverBody, PopoverHeader,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse, Table, Badge
} from 'reactstrap';
import 'whatwg-fetch';
import PurchaseOrders from '../../modules/PurchaseOrderRepo';
import Auth from "../../modules/Auth";
import savingSvg from '../../../images/svg/saving.svg'
import banner from '../../../images/yachtClubLogo.png'
import {Redirect} from 'react-router-dom';

class MyOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion : [true, false, false],
      searchPending: '',
      searchApproved: '',
      searchClosed: '',
      popoverOpen: false,
      loading: true,
      purchaseOrders: {},
      linkId: '',
    };

    this.search = this.search.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.trySearch = this.trySearch.bind(this);
    this.onChange = this.onChange.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
  }

  componentDidMount () {
    Auth.isUserAuthenticated().then(
      (user) => {
        if (user) {
          PurchaseOrders.getAllForName(user.firstName + " " + user.surname).then(
            (ret) => {
              if (!ret) {
                console.log(ret);
                let errors = [];
                errors.push("Error: Unable to get orders at this time")
                this.setState({
                  errors: errors,
                  loading: false,
                })
              }
              else {
                this.setState({
                  loading: false,
                  userData: user,
                  purchaseOrders: ret,
                });
              }
            });
        }
        else {
          this.setState({
            invalidUser: true
          });
        }
      }
    );
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }

  trySearch (event) {
    if (event.key === 'Enter') {
      this.search(event);
      return;
    }
  }

  search (event) {
    console.log('Search!')
  }

  onChange (event) {
    const field = event.target.name;
    this.setState({
      [field]: event.target.value
    })
  }

  togglePopover (event) {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  openOrder (event) {
    this.setState({
      linkId: event,
    })
  }

  render() {
    if (this.state.invalidUser) {
      return (<Redirect push to='/login'/>);
    }

    if (this.state.loading) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <img className={"large-spacer"} src={banner}/>
              <img src={savingSvg}/>
            </Row>
          </Container>
        </div>
      )
    }

    if (this.state.linkId) {
      return (<Redirect push to={'/purchase-order/' + this.state.linkId + '/mine'} />)
    }

    let pendingOrders = [];
    let approvedOrders = [];
    let closedOrders = [];


    console.log(this.state)
    for (let i = 0; i < this.state.purchaseOrders.length; i++) {
      let date = new Date(this.state.purchaseOrders[i].date);
      console.log(this.state.purchaseOrders[i]._id);
      if (this.state.purchaseOrders[i].status === 'Pending')
      {
        pendingOrders.push(
          <tr className={"pointer"} key={this.state.purchaseOrders[i]._id} onClick={() => this.openOrder(this.state.purchaseOrders[i]._id)}>
            <td>{this.state.purchaseOrders[i].purchaseOrderNumber}</td>
            <td>{date.toLocaleDateString('en-GB')}</td>
            <td>{this.state.purchaseOrders[i].company}</td>
            <td>{this.state.purchaseOrders[i].items.length}</td>
            <td>
              <Badge color="warning">{this.state.purchaseOrders[i].status}</Badge>
            </td>
          </tr>
        )
      }
      else if (this.state.purchaseOrders[i].status === 'Approved')
      {
        approvedOrders.push(
          <tr className={"pointer"} key={this.state.purchaseOrders[i]._id} onClick={() => this.openOrder(this.state.purchaseOrders[i]._id)}>
            <td>{this.state.purchaseOrders[i].purchaseOrderNumber}</td>
            <td>{date.toLocaleDateString('en-GB')}</td>
            <td>{this.state.purchaseOrders[i].company}</td>
            <td>{this.state.purchaseOrders[i].items.length}</td>
            <td>
              <Badge color="success">{this.state.purchaseOrders[i].status}</Badge>
            </td>
          </tr>
        )
      }
      else
      {
        closedOrders.push(
          <tr className={"pointer"} key={this.state.purchaseOrders[i]._id} onClick={() => this.openOrder(this.state.purchaseOrders[i]._id)}>
            <td>{this.state.purchaseOrders[i].purchaseOrderNumber}</td>
            <td>{date.toLocaleDateString('en-GB')}</td>
            <td>{this.state.purchaseOrders[i].company}</td>
            <td>{this.state.purchaseOrders[i].items.length}</td>
            <td>
              <Badge color="secondary">{this.state.purchaseOrders[i].status}</Badge>
            </td>
          </tr>
        )
      }
    }

    return (
      <div className="animated fadeIn height-100">
        <Card>
          <CardHeader>
            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]}>
              Pending Orders
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody className={"collapse-scroll"}>
              <InputGroup className="mb-4">
                <Input type="text" name="searchPending" placeholder="Search" id={"searchPending"}
                       value={this.state.searchPending} onChange={this.onChange}
                       onKeyPress={this.trySearch} onClick={this.togglePopover}/>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="searchPending" toggle={this.togglePopover}>
                  <PopoverHeader>Search Help</PopoverHeader>
                  <PopoverBody>You can search orders using order numbers, account alias, or using the name of the peson who raised the order.</PopoverBody>
                </Popover>
                <InputGroupAddon addonType="append">
                  <Button className="btn btn-default" type="submit" name="searchPending" onClick={this.search}><i className="icon-magnifier" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date raised</th>
                    <th>Company</th>
                    <th># of items</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {pendingOrders}
                </tbody>
              </Table>
            </CardBody>
          </Collapse>
        </Card>
        <Card>
          <CardHeader>
            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(1)} aria-expanded={this.state.accordion[1]}>
              Approved Orders
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[1]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              <InputGroup className="mb-4">
                <Input type="text" name="searchApproved" placeholder="Search" id={"searchApproved"}
                       value={this.state.searchApproved} onChange={this.onChange}
                       onKeyPress={this.trySearch}/>
                <InputGroupAddon addonType="append">
                  <Button className="btn btn-default" type="submit" name="searchApproved" onClick={this.search}><i className="icon-magnifier" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Table responsive striped hover>
                <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date raised</th>
                  <th>Company</th>
                  <th># of items</th>
                  <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {approvedOrders}
                </tbody>
              </Table>
            </CardBody>
          </Collapse>
        </Card>
        <Card>
          <CardHeader>
            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(2)} aria-expanded={this.state.accordion[2]}>
              Closed Orders
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[2]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              <InputGroup className="mb-4">
                <Input type="text" name="searchClosed" placeholder="Search" id={"searchClosed"}
                       value={this.state.searchClosed} onChange={this.onChange}
                       onKeyPress={this.trySearch}/>
                <InputGroupAddon addonType="append">
                  <Button className="btn btn-default" type="submit" name="searchClosed" onClick={this.search}><i className="icon-magnifier" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <Table responsive striped hover>
                <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date raised</th>
                  <th>Company</th>
                  <th># of items</th>
                  <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {closedOrders}
                </tbody>
              </Table>
            </CardBody>
          </Collapse>
        </Card>
      </div>
    )
  }
}

export default MyOrders;
