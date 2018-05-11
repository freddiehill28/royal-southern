import React, {Component} from 'react';
import {
  Alert,
  Container,
  Row,
  Col,
  CardGroup,
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import banner from './../../../../images/yachtClubLogo.png';
import Auth from '../../../modules/Auth';


class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      toRegister: false,
      waitingForServer: false,
      signInData: {
        email: '',
        password: ''
      },
      errors: {},
      signedIn: false,
    };

    this.toRegisterPage = this.toRegisterPage.bind(this);
    this.login = this.login.bind(this);
    this.onChange = this.onChange.bind(this);
    this.trySubmit = this.trySubmit.bind(this);
  }

  toRegisterPage(event) {
    this.setState({toRegister: true});
  }

  login(event) {
    fetch('api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.signInData.email,
        password: this.state.signInData.password,
      })
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (!json.success) {
          let error = [];
          error.push(json.message)
          this.setState({
            errors: error
          })
        }
        else {
          Auth.authenticateUser(json.token);
          this.setState({
            signedIn: true
          })
        }
      })
  }

  onChange(event) {
    if (event.key === 'Enter') {
      console.log("trying")
      this.login();
      return;
    }

    const field = event.target.name;
    const signInData = this.state.signInData;
    signInData[field] = event.target.value;

    this.setState({
      signInData
    })
  }

  trySubmit(event) {
    if (event.key === 'Enter') {
      this.login(event);
      return;
    }
  }

  render() {

    if (this.state.signedIn) {
      return (<Redirect push to='/'/>);
    }

    if (this.state.toRegister) {
      return (<Redirect push to='/register'/>);
    }

    let errors;
    if (this.state.errors.length > 0) {
      let errorList = [];
      for (let i = 0; i < this.state.errors.length; i++) {
        errorList.push(<p key={i}>{this.state.errors[i]}</p>)
      }

      errors = (
        <Alert color="danger">
          {errorList}
        </Alert>
      )
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <img className={"large-spacer"} src={banner}/>
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="email" placeholder="Email" value={this.state.signInData.email}
                             onChange={this.onChange} onKeyPress={this.trySubmit}/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="password" placeholder="Password"
                             value={this.state.signInData.password} onChange={this.onChange}
                             onKeyPress={this.trySubmit}/>
                    </InputGroup>
                    {errors}
                    <Row>
                      <Col xs="6">
                        <Button className="px-4 button-colour" onClick={this.login}>Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        {/*TODO Forget password will be added at a later date, once the disertation is complete.
                        To execute this functionality the system will send an email to the user with a temporary unlock password
                        This temporary password will only be active for 15 minutes, and will then expire.
                        Once the account is unlocked with the temporary password the user will need to add a new password*/}
                        {/*<Button color="link" className="px-0">Forgot password?</Button>*/}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white primary-colour py-5" style={{width: 44 + '%'}}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>If you don't already have an account, please register now.</p>
                      <Button className="mt-3 button-colour" onClick={this.toRegisterPage}>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
