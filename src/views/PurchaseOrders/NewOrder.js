import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse
} from 'reactstrap';
import 'whatwg-fetch';
import PurchaseOrders from '../../modules/PurchaseOrders';
import ValidatePurchaseOrder from '../../modules/ValidatePurchaseOrder';
import Auth from "../../modules/Auth";
import savingSvg from '../../../images/svg/saving.svg'
import banner from '../../../images/yachtClubLogo.png'

class NewOrder extends Component {
  constructor(props) {
    super(props);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;

    this.state = {
      orderFormData: {
        purchaseOrderNumber: '-',
        date: today,
        rsrnDept: '',
        company: '',
        paidOnCc: '',
        items: [{
          quantity: '1',
          description: '',
          totalPrice: '0.00',
          unitPrice: '0.00',
          unitNumber: 1,
        }],
      },
      itemsAccordion: [true],
      errors: {},
      raisedOrder: false,
      loading: true,
      invalidUser: false,
      userData: {},
    };

    this.dateChange = this.dateChange.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.processFormChange = this.processFormChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.processTotalChange = this.processTotalChange.bind(this);
    this.processItemChange = this.processItemChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  componentDidMount() {
    Auth.isUserAuthenticated().then(
      (user) => {
        if (user) {
          PurchaseOrders.getNumber().then(
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
              let purchaseOrder = this.state.orderFormData;
              purchaseOrder.purchaseOrderNumber = user.alias + '-' + ret;

              this.setState({
                loading: false,
                userData: user,
                orderFormData: purchaseOrder,
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

  dateChange(event) {
    let date = event.target.value;

    this.setState({
      date: date,
    })
  }

  resetPage() {
    let orderFormData = this.state.orderFormData;

    orderFormData.rsrnDept = '';
    orderFormData.company = '';
    orderFormData.paidOnCc = '';

    orderFormData.items= [{
      quantity: '1',
      description: '',
      totalPrice: '0.00',
      unitPrice: '0.00',
      unitNumber: 1,
    }];

    let itemsAccordion = [true];

    this.setState({
      orderFormData: orderFormData,
      itemsAccordion: itemsAccordion,
      raisedOrder: false,
      errors: {},
    });
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

  toggleAccordion(tab) {

    const prevState = this.state.itemsAccordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      itemsAccordion: state,
    });
  }

  submitForm() {
    const validation = ValidatePurchaseOrder.isValid(this.state.orderFormData);

    let orderFormData = this.state.orderFormData;
    orderFormData.raisedById = this.state.userData._id;

    if (validation.success) {
      PurchaseOrders.saveOrder(orderFormData).then((ret) => {
        if (!ret) {
          let error = [];
          error.push("Error: Unable to save purchase order, please contact system admin and try again later.");
          this.setState({
            errors: error,
          })
        }
        else {

          let orderFormData = this.state.orderFormData;

          const raisedOrder = this.state.orderFormData.purchaseOrderNumber;
          orderFormData.rsrnDept = '';
          orderFormData.company = '';
          orderFormData.paidOnCc = '';

          orderFormData.items= [{
            quantity: '1',
            description: '',
            totalPrice: '0.00',
            unitPrice: '0.00',
            unitNumber: 1,
          }];

          let itemsAccordion = [true];

          PurchaseOrders.getNumber().then(
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
                orderFormData.purchaseOrderNumber = this.state.userData.alias + '-' + ret;

                this.setState({
                  loading: false,
                  orderFormData: orderFormData,
                  itemsAccordion: itemsAccordion,
                  raisedOrder: raisedOrder,
                  errors: {},
                });
              }
            });
        }
      })
    }
    else {
      let error = [];
      error.push(validation.message);
      this.setState({
        errors: error,
      })
    }
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
                <Label htmlFor={"unitPrice"}>Unit Price</Label>
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

    let errors;
    if (this.state.errors.length > 0) {
      let errorList = [];
      for (let i = 0; i < this.state.errors.length; i++) {
        errorList.push(<p key={i}>{this.state.errors[i]}</p>)
      }

      errors = (
        <div>
        <div className={"small-spacer"}/>
          <Alert color="danger">
            {errorList}
          </Alert>
        </div>
      )
    }

    let successAlert;
    if (this.state.raisedOrder) {
      successAlert = (
        <Alert color={"success"}>
        Order raised succesfully with order number {this.state.raisedOrder}
      </Alert>)
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="1s2" sm="6">
            <Card>
              <CardHeader>Hello World!</CardHeader>
              <CardBody>This is where we will have information on the purchase order</CardBody>

            </Card>
          </Col>
          <Col xs={"12"} sm={"6"}>
            <Card>
              <CardHeader>
                <strong>Purchase Order </strong>
                <small>Form</small>
                <div className={"small-spacer"}/>
                <Card>
                  <CardBody>
                    {successAlert}
                    <FormGroup>
                      <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
                      <Input type="text" id={"purchaseOrderNumber"}
                             placeholder={this.state.orderFormData.purchaseOrderNumber} disabled/>
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
                  <CardFooter className={"background-white"}>
                    <Button type="submit" size="sm" color="primary" onClick={this.submitForm}><i
                      className="fa fa-dot-circle-o"/> Submit</Button>
                    &nbsp;
                    <Button type="reset" size="sm" color="danger" onClick={this.resetPage}><i
                      className="fa fa-ban"/> Reset</Button>
                    {errors}
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

export default NewOrder;
