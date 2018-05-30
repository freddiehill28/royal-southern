import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container, Popover, PopoverBody, PopoverHeader,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse, Table, Badge
} from 'reactstrap';
import PurchaseOrders from "../../modules/Repositories/PurchaseOrderRepo";
import Auth from "../../modules/Auth";
import savingSvg from '../../../images/svg/saving.svg';
import banner from '../../../images/yachtClubLogo.png';
import {Redirect} from 'react-router-dom';

class ViewSingleOrder extends Component {
  constructor (props) {
    super(props);

    this.state = {
      orderFormData: {},
      loading: true,
      invalidUser: false,
      errors: {},
      itemsAccordion: [true],
      popoverOpen: false,
      redirect: '',
    };

    this.toggleAccordion = this.toggleAccordion.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.processFormChange = this.processFormChange.bind(this);
    this.processItemChange = this.processItemChange.bind(this);
    this.processTotalChange = this.processTotalChange.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.toggleState = this.toggleState.bind(this);
  }

  componentDidMount () {
    Auth.isUserAuthenticated().then(
      (user) => {
        if (user) {
          PurchaseOrders.getOrderById(this.props.match.params.uid).then(
            (ret) => {
              if (!ret) {
                console.log(ret);
                let errors = [];
                errors.push("Error: Unable to get order number at this time")
                this.setState({
                  errors: errors,
                  loading: false,
                })
              }
              else {
                let date = new Date(ret.date);
                let accordArry = [true];

                for (let i = 1; i < ret.items.length; i++)
                {
                  accordArry.push(false);
                }

                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let dt = date.getDate();

                if (dt < 10) {
                  dt = '0' + dt;
                }
                if (month < 10) {
                  month = '0' + month;
                }

                ret.date = (year+'-' + month + '-'+dt);

                this.setState({
                  loading: false,
                  userData: user,
                  orderFormData: ret,
                  itemsAccordion: accordArry,
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

    const prevState = this.state.itemsAccordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      itemsAccordion: state,
    });
  }

  togglePopover (event) {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  deleteOrder (event) {
    PurchaseOrders.deleteOrderById(this.state.orderFormData._id)
      .then(ret =>  {
        if (!ret) {
          console.log(ret);
          let errors = [];
          errors.push("Error: Unable to delete order at this time");
          this.setState({
            errors: errors,
            loading: false,
          })
        }
        else {
          this.setState({
            redirect: this.props.match.params.origin,
          })
        }
      })
  }

  updateOrder (event) {
    PurchaseOrders.updateOrderById(this.state.orderFormData._id, this.state.orderFormData)
      .then((ret) => {
        if (!ret) {
          console.log(ret);
          let errors = [];
          errors.push("Error: Unable update order at this time");
          this.setState({
            errors: errors,
            loading: false,
          })
        }
        else {
          // TODO UPDATE SUCCESS MESSAGE
        }
      })
  }

  processFormChange(event) {
    const field = event.target.name;
    const orderFormData = this.state.orderFormData;
    orderFormData[field] = event.target.value;

    orderFormData.totalPrice =
      ((orderFormData.quantity / orderFormData.unitNumber) * orderFormData.unitPrice).toFixed(2);

    this.setState({
      orderFormData
    });
  }

  processItemChange(event) {
    const id = event.target.id;
    const field = event.target.name;
    const orderFormData = this.state.orderFormData;
    orderFormData.items[id][field] = event.target.value;

    orderFormData.items[id].totalPrice =
      ((orderFormData.items[id].quantity / orderFormData.items[id].unitNumber) * orderFormData.items[id].unitPrice).toFixed(2);

    this.setState({
      orderFormData
    });
  }

  processTotalChange(event) {
    const id = event.target.id;
    const field = event.target.name;
    const orderFormData = this.state.orderFormData;
    orderFormData.items[id][field] = event.target.value;

    this.setState({
      orderFormData
    });
  }

  addItem(event) {
    const item = {
      quantity: '1',
      description: '',
      totalPrice: '0.00',
      unitPrice: '0.00',
      unitNumber: 1,
    };

    const orderFormData = this.state.orderFormData;
    orderFormData.items.push(item);

    const itemsAccordion = this.state.itemsAccordion;
    itemsAccordion.push(false);

    this.setState({
      orderFormData: orderFormData,
      itemsAccordion: itemsAccordion
    });
  }

  toggleState (event) {
    let status;
    if (event.target.name === "approvalCheck") {
      if (this.state.orderFormData.status === "Pending") {
        status = "Approved";
      }
      else {
        status = "Pending";
      }
    }
    else {
      if (this.state.orderFormData.status === "Approved") {
        status = "Completed"
      }
      else {
        status = "Approved"
      }
    }

    let orderFormData = this.state.orderFormData;
    orderFormData.status = status;

    this.setState ({
      orderFormData: orderFormData,
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

    if (this.state.redirect) {
      return (<Redirect push to={'/purchase-order/' + this.state.redirect} />)
    }

    let adminSwitch;

    if (this.state.userData.level === "1" && (this.state.orderFormData.status === "Pending" || this.state.orderFormData.status === "Approved")) {
      let switchState = true;
      if (this.state.orderFormData.status === "Pending") switchState = false;

      adminSwitch = (
        <CardFooter className={"background-white"}>
          <Label className="switch switch-icon switch-pill switch-success">
            <Input type="checkbox" className="switch-input"
              name={"approvalCheck"}
              checked={switchState}
              onClick={this.toggleState} />
            <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'} />
            <span className="switch-handle" />
          </Label>
          &nbsp;&nbsp;&nbsp;Approved
        </CardFooter>
      );
    }

    let completedSwtich;

    if (this.state.orderFormData.status === "Approved" || this.state.orderFormData.status === "Completed" ) {
      let switchState = true;
      if (this.state.orderFormData.status === "Approved") switchState = false;
      completedSwtich = (
        <CardFooter className={"background-white"}>
          <Label className="switch switch-icon switch-pill switch-success">
            <Input type="checkbox" className="switch-input"
              name={"completedCheck"}
              checked={switchState}
              onClick={this.toggleState}/>
            <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'} />
            <span className="switch-handle" />
          </Label>
          &nbsp;&nbsp;&nbsp;Completed
        </CardFooter>
      )
    }



    let itemCards = [];

    for (let i = 0; i < this.state.orderFormData.items.length; i++) {
      itemCards.push(
        <Card>
          <CardHeader>
            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(i)} aria-expanded={this.state.itemsAccordion[i]}>
              Item #{i+1}
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.itemsAccordion[i]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
              <FormGroup>
                <Label htmlFor={"quantity"}>Quantity</Label>
                <Input type={"text"} name={"quantity"} id={i} placeholder={"Quantity"}
                       value={this.state.orderFormData.items[i].quantity}
                       onChange={this.processItemChange}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"description"}>Description</Label>
                <Input type={"textarea"} name={"description"} id={i} placeholder={"Description..."}
                       rows={"4"}
                       value={this.state.orderFormData.items[i].description}
                       onChange={this.processItemChange}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"unitPrice"}>Price</Label>
                <Row>
                  <Col md={"6"}>
                    <div className={"controls"}>
                      <InputGroup className="input-prepend">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>£</InputGroupText>
                        </InputGroupAddon>
                        <Input type={"text"} name={"unitPrice"} id={i} placeholder={"00.00"}
                               value={this.state.orderFormData.items[i].unitPrice}
                               onChange={this.processItemChange}/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;for
                      </InputGroup>
                    </div>
                  </Col>
                  <Col md={"4"}>
                    <Input type={"text"} name={"unitNumber"} id={i}
                           value={this.state.orderFormData.items[i].unitNumber}
                           onChange={this.processItemChange}/>
                  </Col>
                  <Col md={"2"}>
                    <div>units</div>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"totalPrice"}>Total Price</Label>
                <div className={"controls"}>
                  <InputGroup className="input-prepend">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>£</InputGroupText>
                    </InputGroupAddon>
                    <Input type={"text"} name={"totalPrice"} id={i} placeholder={"00.00"}
                           value={this.state.orderFormData.items[i].totalPrice}
                           onChange={this.processTotalChange}/>
                  </InputGroup>
                </div>
              </FormGroup>
            </CardBody>
          </Collapse>
        </Card>);
    }

    return (
        <div className="animated fadeIn">
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <strong>Purchase Order </strong>
                  <small>Form</small>
                  <div className={"small-spacer"}/>
                  <Card>
                    <CardBody>
                      <FormGroup>
                        <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
                        <Input type="text" id={"purchaseOrderNumber"}
                               placeholder={this.state.orderFormData.purchaseOrderNumber} disabled/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor="purchaseOrderStatus">Status</Label>
                        <Input type="text" id={"purchaseOrderStatus"}
                               placeholder={this.state.orderFormData.status} disabled/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor={"date"}>Date</Label>
                        <Input type={"date"} id={"date"} name={"date"}
                               value={this.state.orderFormData.date}
                               onChange={this.processFormChange}/>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor={"rsrnDept"}>RSRN Dept.</Label>
                        <Input type={"text"} id={"rsrnDept"} name={"rsrnDept"} placeholder={"RSRN Dept."}
                               value={this.state.orderFormData.rsrnDept}
                               onChange={this.processFormChange}/>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor={"company"}>Company/Supplier</Label>
                        <Input type={"text"} id={"company"} name={"company"} placeholder={"Company/Supplier"}
                               value={this.state.orderFormData.company}
                               onChange={this.processFormChange}/>
                      </FormGroup>
                      <FormGroup>
                        <Label htmlFor={"paidOnCc"}>Paid on C/C</Label>
                        <Input type={"text"} id={"paidOnCc"} name={"paidOnCc"} placeholder={"Paid on C/C"}
                               value={this.state.orderFormData.paidOnCc}
                               onChange={this.processFormChange}/>
                      </FormGroup>
                      <div id="accordion">
                        {itemCards}
                      </div>
                      <Button type="submit" size="sm" color="primary" onClick={this.addItem}><i
                        className="fa fa-plus-circle"/> Add Item</Button>
                    </CardBody>
                    {adminSwitch}
                    {completedSwtich}
                    <CardFooter className={"background-white"}>
                      <Button id={"updateBtn"} type="submit" size="sm" color="primary" onClick={this.updateOrder}><i
                        className="fa fa-dot-circle-o"/> Update</Button>
                      &nbsp;
                      <Button id={"deleteBtn"} type="reset" size="sm" color="danger" onClick={this.togglePopover}><i
                        className="fa fa-ban"/> Delete</Button>
                      <Popover placement="bottom" isOpen={this.state.popoverOpen} target="deleteBtn" toggle={this.togglePopover}>
                        <PopoverHeader className={"text-center"}>Delete?</PopoverHeader>
                        <PopoverBody>
                          <Button type="submit" size="sm" color="primary" onClick={this.deleteOrder}><i
                            className="fa"/>Yes</Button>
                          &nbsp;
                          <Button type="reset" size="sm" color="danger" onClick={this.togglePopover}><i
                            className="fa"/>No</Button>
                        </PopoverBody>
                      </Popover>
                    </CardFooter>
                  </Card>
                </CardHeader>
              </Card>
            </Col>
          </Row>
        </div>
    )
  }
}

export default ViewSingleOrder;
