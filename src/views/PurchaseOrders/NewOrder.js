import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Col,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup} from 'reactstrap';

class NewOrder extends Component {
  constructor (props) {
    super(props);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd;
    }
    if(mm<10){
      mm='0'+mm;
    }

    today = yyyy+'-'+mm+'-'+dd;

    this.state = {
      orderFormData: {
        purchaseOrderNumber: 2,
        date: today,
        quantity: '',
        rsrnDept: '',
        description: '',
        company: '',
        price: '',
        paidOnCc: '',
      }
    };

    this.dateChange = this.dateChange.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.processChange = this.processChange.bind(this);
  }

  dateChange(event){
    let date = event.target.value;

    this.setState({
      date: date,
    })
  }

  resetPage() {
    let orderFormData = this.state.orderFormData;

      orderFormData.quantity    = '';
      orderFormData.rsrnDept    = '';
      orderFormData.description = '';
      orderFormData.company     = '';
      orderFormData.price       = '';
      orderFormData.paidOnCc    = '';

    this.setState({
      orderFormData: orderFormData,
    });
  }

  processChange (event) {
    const field = event.target.name;
    const orderFormData = this.state.orderFormData;
    orderFormData[field] = event.target.value;

    this.setState({
      orderFormData
    });
  }

  render() {
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
                    <FormGroup>
                      <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
                      <Input type="text" id={"purchaseOrderNumber"} placeholder={this.state.orderFormData.purchaseOrderNumber} disabled />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"date"}>Date</Label>
                      <Input type={"date"} id={"date"} name={"date"} value={this.state.orderFormData.date} onChange={this.processChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"quantity"}>Quantity</Label>
                      <Input type={"text"} id={"quantity"} name={"quantity"} placeholder={"Quantity"} value={this.state.orderFormData.quantity} onChange={this.processChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"rsrnDept"}>RSRN Dept.</Label>
                      <Input type={"text"} id={"rsrnDept"} name={"rsrnDept"} placeholder={"RSRN Dept."} value={this.state.orderFormData.rsrnDept} onChange={this.processChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"description"}>Description</Label>
                      <Input type={"textarea"} id={"description"} name={"description"} placeholder={"Description..."} rows={"6"} value={this.state.orderFormData.description} onChange={this.processChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"company"}>Company/Supplier</Label>
                      <Input type={"text"} id={"company"} name={"company"} placeholder={"Company/Supplier"} value={this.state.orderFormData.company} onChange={this.processChange} />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"price"}>Price</Label>
                      <div className={"controls"}>
                        <InputGroup className="input-prepend">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>£</InputGroupText>
                          </InputGroupAddon>
                          <Input type={"text"} id={"price"} name={"price"} value={this.state.orderFormData.price} onChange={this.processChange} />
                        </InputGroup>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor={"paidOnCc"}>Paid on C/C</Label>
                      <Input type={"text"} id={"paidOnCc"} name={"paidOnCc"} placeholder={"Paid on C/C"} value={this.state.orderFormData.paidOnCc} onChange={this.processChange} />
                    </FormGroup>
                  </CardBody>
                  <CardFooter className={"background-white"}>
                    <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o" /> Submit</Button>
                    &nbsp;
                    <Button type="reset" size="sm" color="danger" onClick={this.resetPage}><i className="fa fa-ban" /> Reset</Button>
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
