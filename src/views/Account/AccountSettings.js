import React, {Component} from 'react';
import {
  Card, CardBody, CardHeader, CardFooter, Col, Alert, Container, Popover, PopoverBody, PopoverHeader,
  FormGroup, Label, Input, Row, Button, InputGroupAddon, InputGroupText, InputGroup, Collapse, Table, Badge
} from 'reactstrap';
import Auth from "../../modules/Auth";
import savingSvg from '../../../images/svg/saving.svg';
import banner from '../../../images/yachtClubLogo.png';
import {Redirect} from 'react-router-dom';
import Users from '../../modules/Repositories/UserRepo';

function validatePassword(password) {
  var re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  return re.test(String(password));
}

class AccountSettings extends Component {
  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      invalidUser: false,
      userData: {},
      allUsers: {},
      changePassword: {
        current: '',
        new: '',
        repeatNew: '',
      },
      errors: {},
      successes: {},
    }

    this.onChange = this.onChange.bind(this);
    this.changeAdmin = this.changeAdmin.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount () {
    Auth.isUserAuthenticated().then(
      (user) => {
        if (user) {
          if (user.level >= 1) {
            Users.getAllUsers().then(
              (ret) => {
                if (!ret) {
                  console.log(ret);
                  let errors = [];
                  errors.push("Error: Unable to get users at this time")
                  this.setState({
                    errors: errors,
                    loading: false,
                  })
                }
                else {
                  this.setState({
                    loading: false,
                    userData: user,
                    allUsers: ret,
                  });
                }
              }
            )
          }
          this.setState({
            loading: false,
            userData: user,
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
    let password = this.state.changePassword;
    password[event.target.name] = event.target.value;

    this.setState({
      changePassword: password,
    })
  }

  changeAdmin (event) {
    let id = event.target.id;
    let users = this.state.allUsers;

    if (users[event.target.name].level > 0) {
      users[event.target.name].level = 0;
    }
    else {
      users[event.target.name].level = 1;
    }

    Users.updateUserById(id, users[event.target.name])
      .then(
      (ret) => {
        if (!ret) {
          let adminErrors = [];
          adminErrors.push("Error: Unable to update the users admin status at this time")
          this.setState({
            adminErrors: adminErrors,
            loading: false,
          })
        }
      });

    this.setState({
      allUsers:users,
    })
  }

  changePassword (event) {
    if (this.state.changePassword.current === '' ||
      this.state.changePassword.new !== this.state.changePassword.repeatNew) {
      let error = [];
      error.push('Error: Passwords do not match!');
      this.setState({
        errors: error
      })
    }
    else if (!validatePassword(this.state.changePassword.new)) {
      let error = [];
      error.push("Error: Password should");
      error.push("•	Contain 8 or more characters");
      error.push("•	Contain 1 or more upper case letters");
      error.push("•	Contain 1 or more lower case letters");
      error.push("•	Contain 1 or more numbers");
      this.setState({
        errors: error
      })
    }

    fetch('api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.userData.email,
        password: this.state.changePassword.current,
      })
    }).then(res => res.json())
      .then(json => {
        if (!json.success) {
          let error = [];
          let successes = [];
          error.push("Error: Current password is not correct");
          this.setState({
            errors: error,
            successes: successes,
          })
        }
        else {
          Users.changePassword(this.state.userData._id, this.state.changePassword.new).then(
            ret => {
              if(!ret) {
                let error = [];
                this.setState({
                  errors: error
                })
              }
              else {
                let error = [];
                let successes = [];
                successes.push('Password Changed!');
                this.setState({
                  errors: error,
                  successes: successes,
                })
              }
            }
          )
        }
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

    let successes;
    if (this.state.successes.length > 0) {
      let successList = [];
      for (let i = 0; i < this.state.successes.length; i++) {
        successList.push(<p key={i}>{this.state.successes[i]}</p>)
      }

      successes = (
        <Alert color="success">
          {successList}
        </Alert>
      )
    }

    let adminControl;
    let listUsers = [];

    if (this.state.userData.level > 0) {
      for (let i = 0; i < this.state.allUsers.length; i++) {
        if (this.state.allUsers[i]._id !== this.state.userData._id) {
          let badgeColor = "secondary";
          let adminLevel = "User";

          if (this.state.allUsers[i].level > 0)
          {
            badgeColor = "success";
            adminLevel = "Admin";
          }

          listUsers.push(
            <tr key={this.state.allUsers[i]._id}>
              <td>{this.state.allUsers[i].alias}</td>
              <td>{this.state.allUsers[i].firstName + ' ' + this.state.allUsers[i].surname}</td>
              <td>{this.state.allUsers[i].email}</td>
              <td>
                <Badge color={badgeColor}>{adminLevel}</Badge>
              </td>
              <td>
                <Label className="switch switch-icon switch-pill switch-success">
                  <Input type="checkbox" className="switch-input"
                         name={i}
                         id={this.state.allUsers[i]._id}
                         checked={parseInt(this.state.allUsers[i].level)}
                         onClick={this.changeAdmin} />
                  <span className="switch-label" data-on={'\uf00c'} data-off={'\uf00d'} />
                  <span className="switch-handle" />
                </Label>
              </td>
            </tr>
          )
        }
      }

      adminControl = (
        <Card>
          <CardHeader>
            <strong>Admin Control</strong>
          </CardHeader>
          <CardBody>
            <Table responsive striped>
              <thead>
              <tr>
                <th>Alias</th>
                <th>Name</th>
                <th>Email</th>
                <th>Level</th>
                <th>Set Admin</th>
              </tr>
              </thead>
              <tbody>
              {listUsers}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )
    }

    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <strong>{this.state.userData.firstName+' '+this.state.userData.surname}</strong>
          </CardHeader>
          <CardHeader className={'background-white'}>
            <Label>Change Password</Label>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label>Current Password</Label>
              <Input type={"password"} name={"current"} placeholder={"Current password"}
                     value={this.state.changePassword.current}
                     onChange={this.onChange}/>
            </FormGroup>
            <FormGroup>
              <Label>New Password</Label>
              <Input type={"password"} name={"new"} placeholder={"New password"}
                     value={this.state.changePassword.new}
                     onChange={this.onChange}/>
            </FormGroup>
            <FormGroup>
              <Label>Repeat New Password</Label>
              <Input type={"password"} name={"repeatNew"} placeholder={"Repeat password"}
                     value={this.state.changePassword.repeatNew}
                     onChange={this.onChange}/>
            </FormGroup>
            {errors}
            {successes}
          </CardBody>
          <CardFooter className={'background-white'}>
            <Button type="submit" size="sm" color="primary" onClick={this.changePassword}><i
              className="fa icon-key"/> Change</Button>
          </CardFooter>
        </Card>
        {adminControl}
      </div>
    );
  }
}

export default AccountSettings;
