import React, {Component} from 'react';
import {Card, CardBody, CardHeader, CardFooter, Col, Row, Button} from 'reactstrap';

class NewOrder extends Component {
    render() {
        return (
            <div className="animated fadeIn">
              <Row>
                <Col xs="12" sm="6">
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
                        <CardBody>Test</CardBody>
                        <CardFooter className={"background-white"}>
                          <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                          <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
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
