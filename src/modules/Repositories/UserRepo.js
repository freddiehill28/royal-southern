class Users {

  static getAllUsers () {
    return new Promise ((ret) => {
      fetch('/api/users/all')
        .then(res => res.json())
        .then(json => {
          if (!json.success) {
            ret(Promise.resolve(false));
          }
          else {
            ret(Promise.resolve(json.message));
          }
        })
    })
  }

  static updateUserById (id, user) {
    return new Promise ((ret) => {
      fetch('/api/users/update/?id='+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: user,
        })
      }).then(res => res.json())
        .then(json => {
          ret(Promise.resolve(json.success))
        });
    })
  }

  static changePassword (id, password) {
    return new Promise ((ret) => {
      fetch('/api/users/changePassword/?id='+id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
        })
      }).then(res => res.json())
        .then(json => {
          ret(Promise.resolve(json.success))
        });
    })
  }


}

export default Users;
