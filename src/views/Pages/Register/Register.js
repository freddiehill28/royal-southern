import React, {Component} from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Alert
} from 'reactstrap';
import 'whatwg-fetch';
import {HashRouter, Redirect, Route, Link, Switch} from 'react-router-dom';
import savingSvg from '../../../../images/svg/saving.svg';

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email));
}

function validatePassword(password) {
  var re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  return re.test(String(password));
}

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

  processChange(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  submitForm(event) {
    const user = this.state.user;

    this.setState({
      waitingForServer: true
    });

    if (!user.firstName || !user.surname) {
      let error = [];
      error.push('Error: Please enter both first name and surname.');
      this.setState({
        errors: error,
        waitingForServer: false,
      })
    }
    else if (!validateEmail(user.email)) {
      let error = [];
      error.push('Error: Please enter a valid email address.');
      this.setState({
        errors: error,
        waitingForServer: false,
      })
    }
    else if (user.password !== user.repeatPassword) {
      let error = [];
      error.push('Error: Passwords do not match!');
      this.setState({
        errors: error,
        waitingForServer: false,
      })
    }
    else if (!validatePassword(user.password)) {
      console.log(validatePassword(user.password));
      let error = [];
      error.push("Error: Password should");
      error.push("•	Contain 8 or more characters");
      error.push("•	Contain 1 or more upper case letters");
      error.push("•	Contain 1 or more lower case letters");
      error.push("•	Contain 1 or more numbers");
      this.setState({
        errors: error,

        waitingForServer: false,
      })
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
          else {
            let error = [];
            error.push(json.message);
            this.setState({
              waitingForServer: false,
              errors: error,
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
                        Account created successfully; <Link to="/login" className="alert-link">login here</Link>. Or
                        create <Link to={"/register"} className="alert-link">another account.</Link>
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
      let errorList = [];
      for (let i = 0; i < this.state.errors.length; i++) {
        errorList.push(<p key={i}>{this.state.errors[i]}</p>)
      }

      errorsMarkup = (
        <CardFooter className="p-4">

          <Alert color="danger">
            {errorList}
          </Alert>

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
                    <Input type="text" name={"firstName"} placeholder="First Name" value={this.state.user.firstName}
                           onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-user"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name={"surname"} placeholder="Surname" value={this.state.user.surname}
                           onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>@</InputGroupText>
                    </InputGroupAddon>
                    <Input type="text" name={"email"} placeholder="Email" value={this.state.user.email}
                           onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name={"password"} placeholder="Password" value={this.state.user.password}
                           onChange={this.processChange}/>
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="icon-lock"/>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input type="password" name={"repeatPassword"} placeholder="Repeat password"
                           value={this.state.user.repeatPassword} onChange={this.processChange}/>
                  </InputGroup>
                  {this.state.waitingForServer &&
                  <Button className="mt-3 button-colour" block><img src={savingSvg}/></Button>}
                  {!this.state.waitingForServer &&
                  <Button className="mt-3 button-colour" block onClick={this.submitForm}>Create Account</Button>}
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
