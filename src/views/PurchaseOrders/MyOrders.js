import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse
} from 'reactstrap';
import 'whatwg-fetch';

class MyOrders extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accordion : [true, false, false]
    }


    this.toggleAccordion = this.toggleAccordion.bind(this);
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }
  render() {
    return (
      <div className="animated fadeIn height-100">
        <Card>
          <CardHeader>
            <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(0)} aria-expanded={this.state.accordion[0]}>
              Pending Orders
            </Button>
          </CardHeader>
          <Collapse isOpen={this.state.accordion[0]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
            <CardBody>
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
            </CardBody>
          </Collapse>
        </Card>
      </div>
    )
  }
}

export default MyOrders;
