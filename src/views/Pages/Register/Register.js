import React, {Component} from 'react';
import {Container, Row, Col, Card, CardBody, CardFooter, Button, Input, InputGroup, InputGroupAddon, InputGroupText, Alert} from 'reactstrap';
import 'whatwg-fetch';
import {HashRouter, Redirect, Route, Link, Switch} from 'react-router-dom';
import savingSvg from '../../../../images/svg/saving.svg';

class Register extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        firstName: '',
        surname: '',
        email: '',
        password: '',
        repeatPassword: '',
      },
      waitingForServer: false,
      accountCreated: false,
    };

    this.processChange = this.processChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  processChange (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  submitForm (event) {
    const user = this.state.user;

    this.setState({
      waitingForServer: true
    });

    if (user.password !== user.repeatPassword) {
      this.setState({errors: 'passwords not the same'})
    }
    else {
      fetch('/api/account/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          firstName: user.firstName,
          surname: user.surname,
          password: user.password
        })
      }).then(res => res.json())
        .then(json => {
          console.log('json', json);
          if (json.success) {
            this.setState({
              accountCreated: true,
            })
          }
        })
    }
  }

  render() {

    if (this.state.accountCreated) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="6">
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <h1>Register</h1>
                    <Row>
                      <Col>
                        <p className="text-muted">Create your account</p>
                      </Col>
                      <Col className="text-right">
                        <Link to="/login">Back to login</Link>
                      </Col>
                    </Row>
                    <Row>
                      <Alert color="success">
                        Account created successfully; <Link to="/login" className="alert-link">login here</Link>. Or create <Link to={"/register"} className="alert-link">another account.</Link>
                      </Alert>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )
    }

    let errorsMarkup;

    if (this.state.errors.length > 0) {
      errorsMarkup = (
        <CardFooter className="p-4">
          <Row>
            <p>Passwords not the same</p>
          </Row>
        </CardFooter>
      )
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <Row>
                    <Col>
                      <p className="text-muted">Create your account</p>
                    </Col>
                    <Col className="text-right">
                      <Link to="/login">Back to login</Link>
                    </Col>
                  </Row>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name={"firstName"} placeholder="First Name" value={this.state.user.firstName} onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name={"surname"} placeholder="Surname" value={this.state.user.surname} onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name={"email"} placeholder="Email" value={this.state.user.email} onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name={"password"} placeholder="Password" value={this.state.user.password} onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name={"repeatPassword"} placeholder="Repeat password" value={this.state.user.repeatPassword} onChange={this.processChange}/>
                  </InputGroup>
                  {this.state.waitingForServer && <Button  color="success" block><img src={savingSvg}/></Button>}
                  {!this.state.waitingForServer && <Button color="success" block onClick={this.submitForm}>Create Account</Button>}
                </CardBody>
                {errorsMarkup}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
