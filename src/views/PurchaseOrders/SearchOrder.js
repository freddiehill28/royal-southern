import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container, Popover, PopoverBody, PopoverHeader, Pagination,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse, Table, Badge,
  PaginationItem, PaginationLink
} from 'reactstrap';
import PurchaseOrders from '../../modules/Repositories/PurchaseOrderRepo';
import Auth from "../../modules/Auth";
import savingSvg from '../../../images/svg/saving.svg'
import banner from '../../../images/yachtClubLogo.png'
import {Redirect} from 'react-router-dom';

class SearchOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false,
      search: '',
      loading: true,
      invalidUser: false,
      purchaseOrders: {},
      linkId: '',
      currentPaginationPage: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.openOrder = this.openOrder.bind(this);
  }

  componentDidMount () {
    Auth.isUserAuthenticated().then(
      (user) => {
        if (user) {
          PurchaseOrders.getAllOrders().then(
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

  onChange (event) {
    const field = event.target.name;
    this.setState({
      [field]: event.target.value,
      currentPaginationPage: 0,
    })
  }

  togglePopover (event) {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  goToPage (event) {
    this.setState({
      currentPaginationPage: event.target.id,
    })
  }

  openOrder (event) {
    this.setState({
      linkId: event,
    })
  }

  render() {
    console.log(this.state.purchaseOrders);

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
      return (<Redirect push to={'/purchase-order/' + this.state.linkId + '/find'} />)
    }

    let filteredOrders = [];

    for (let i = 0; i < this.state.purchaseOrders.length; i++) {
      if ((this.state.search === '') ||
        (this.state.purchaseOrders[i].purchaseOrderNumber.toLowerCase().includes(this.state.search.toLowerCase()) ||
          this.state.purchaseOrders[i].raisedBy.toLowerCase().includes(this.state.search.toLowerCase())
        )) {
        filteredOrders.push(this.state.purchaseOrders[i]);
      }
    }

    let orders = [];

    let numPages = Math.floor(filteredOrders.length/15);
    numPages= Math.max(0, numPages-1);

    let startOrder = numPages * 15;

    let endOrder = startOrder+15;
    if (endOrder > filteredOrders.length) {
      endOrder = filteredOrders.length;
    }

    for (let i = startOrder; i < endOrder; i++) {
      let date = new Date(filteredOrders[i].date);
      let badgeColor;

      if (this.state.purchaseOrders[i].status === 'Pending')
      {
        badgeColor="warning";
      }
      else if (this.state.purchaseOrders[i].status === 'Approved')
      {
        badgeColor="success";
      }
      else
      {
        badgeColor="secondary";
      }

      orders.push(
        <tr className={"pointer"} key={filteredOrders[i]._id}
            onClick={() => this.openOrder(filteredOrders[i]._id)}>
          <td>{filteredOrders[i].purchaseOrderNumber}</td>
          <td>{date.toLocaleDateString('en-GB')}</td>
          <td>{filteredOrders[i].company}</td>
          <td>{filteredOrders[i].items.length}</td>
          <td>
            <Badge color={badgeColor}>{filteredOrders[i].status}</Badge>
          </td>
        </tr>
      )
    }

    let paginationStart = 0;
    let paginationItems = [];

    if (numPages > 4) {
      paginationStart = this.state.currentPaginationPage-2;
      numPages = Math.min(this.state.currentPaginationPage+2, numPages);
    }

    paginationStart++;
    numPages;

    for (let i = paginationStart; i <= numPages+1; i++)
    {
      if(this.state.currentPaginationPage == i-1) {
        paginationItems.push(
          <PaginationItem key={i} active><PaginationLink id={i-1} onClick={this.goToPage} tag="button">{i}</PaginationLink></PaginationItem>
        )
      }
      else {
        paginationItems.push(
          <PaginationItem key={i}><PaginationLink id={i-1} onClick={this.goToPage} tag="button">{i}</PaginationLink></PaginationItem>
        )
      }
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            Purchase Orders
          </CardHeader>
          <CardBody>
            <InputGroup className="mb-4">
              <Input type="text" name="search" placeholder="Search" id={"searchPending"}
                     value={this.state.search} onChange={this.onChange}
                     onClick={this.togglePopover}/>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="searchPending" toggle={this.togglePopover}>
                <PopoverHeader>Search Help</PopoverHeader>
                <PopoverBody>You can search orders using order numbers, account alias, or using the name of the person who raised the order.</PopoverBody>
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
              {orders}
              </tbody>
            </Table>
            <Pagination>
              <PaginationItem><PaginationLink tag="button" id={'0'} onClick={this.goToPage}>First</PaginationLink></PaginationItem>
              {paginationItems}
              <PaginationItem><PaginationLink tag="button" id={numPages} onClick={this.goToPage}>Last</PaginationLink></PaginationItem>
            </Pagination>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default SearchOrder;
