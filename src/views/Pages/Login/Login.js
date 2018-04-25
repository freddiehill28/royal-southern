import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, InputGroupText} from 'reactstrap';

import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import banner from './../../../../images/yachtClubLogo.png'


class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {toRegister: false};

    this.toRegisterPage = this.toRegisterPage.bind(this);
  }

  toRegisterPage(event) {
    this.setState({toRegister: true});
  }

  render() {

    if(this.state.toRegister) {
      return (<Redirect push to='/register' />);
    }

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <img className={"large-spacer"} src={banner} />
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
                      <Input type="text" placeholder="Email"/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"/>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Password"/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button className="px-4 button-colour">Login</Button>
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
                <Card className="text-white primary-colour py-5" style={{ width: 44 + '%' }}>
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
