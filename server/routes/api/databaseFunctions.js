const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const PurchaseOrder = require('../../models/PurchaseOrder');
const PurchaseOrderNumbers = require('../../models/PurchaseOrderNumbers')

module.exports = (app) => {

  // ACCOUNT

  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;
    const { firstName} = body;
    const { surname } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      })
    }

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: First name cannot be blank.'
      })
    }

    if (!surname) {
      return res.send({
        success: false,
        message: 'Error: Surname cannot be blank.'
      })
    }

    // TODO Add more password validation
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      })
    }

    // Verify username does not exist
    User.find({email: email}, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error on read'
        });
      }
      else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Email already exists, try logging in with your email.'
        });
      }

      // Save the new account
      const newUser = new User();

      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.firstName = firstName;
      newUser.surname = surname;
      newUser.alias = (firstName[0] + surname[0] + surname[1] + surname[2]).toUpperCase();

      newUser.save ((err, user) => {
        if(err) {
          return res.send({
            success: false,
            message: 'Error: Server error on save'
          })
        }

        return res.send({
          success: true,
          message: 'Registration complete'
        })
      })
    });
  });

  app.post('/api/account/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let {email} = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }
    email = email.toLowerCase();
    email = email.trim();
    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length !== 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid Username or Password'
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid Username or Password'
        });
      }
      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }
        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
    });
  });

  app.get('/api/account/logout', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted:true
      }
    }, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
  });

  app.get('/api/account/verify', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        User.findOne({
          _id: sessions[0].userId
        }, (err, userData) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: No registered user',
            });
          }
          else {
            return res.send({
              success: true,
              message: 'Good',
              userData: userData,
            });
          }
        });
      }
    });
  });

  // PURCHASE ORDERS

  app.post('/api/purchaseOrder/new', (req, res, next) => {
    const {body} = req;

    const newPurchaseOrder = new PurchaseOrder();

    newPurchaseOrder.raisedBy = body.orderFormData.raisedBy;
    newPurchaseOrder.raisedById = body.orderFormData.raisedById;
    newPurchaseOrder.purchaseOrderNumber = body.orderFormData.purchaseOrderNumber;
    newPurchaseOrder.date = body.orderFormData.date;
    newPurchaseOrder.rsrnDept = body.orderFormData.rsrnDept;
    newPurchaseOrder.company = body.orderFormData.company;
    newPurchaseOrder.paidOnCc = body.orderFormData.paidOnCc;
    newPurchaseOrder.items = body.orderFormData.items;


    newPurchaseOrder.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      return res.send({
        success: true,
        message: 'Purchase Order saved!'
      });
    })
  });

  // Gets the latest purchase order, and adds 1 to the number stored
  app.get('/api/purchaseOrder/number', (req, res, next) => {
    PurchaseOrderNumbers.findOne().sort('-purchaseOrderNumber').exec(
      (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Internal server error",
          })
        }
        else {
          const purchaseOrderNumbers = new PurchaseOrderNumbers();
          purchaseOrderNumbers.purchaseOrderNumber = sessions.purchaseOrderNumber + 1;
          purchaseOrderNumbers.save((err, doc) => {
            if (err) {
              console.log(err);
              return res.send({
                success: false,
                message: "Internal server error",
              })
            }
            else {
              return res.send({
                success: true,
                message: sessions.purchaseOrderNumber,
              })
            }
          })
        }
      }
    );
  });

  app.get('/api/purchaseOrder/name', (req, res, next) => {
    const { query } = req;
    const { name } = query;

    PurchaseOrder.find({
      'raisedBy': name,
    }, (err, order) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      else {
        return res.send({
          success: true,
          message: order,
        })
      }
    });
  });

  app.get('/api/purchaseOrder/id', (req, res, next) => {
    const { query } = req;
    const { id } = query;

    PurchaseOrder.findOne({
      '_id': id,
    }, (err, order) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      else {
        return res.send({
          success: true,
          message: order,
        })
      }
    });
  });

  app.get('/api/purchaseOrder/all', (req, res, next) => {
    PurchaseOrder.find({}, (err, orders) => {
      if (err){
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      else {
        return res.send({
          success: true,
          message: orders,
        })
      }
    });
  });

  app.put('/api/purchaseOrder/update', (req, res, next) => {
    const { query } = req;
    const { id } = query;
    const { body } = req;

    PurchaseOrder.findOne({
      '_id': id,
    }, (err, order) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Purchase order doesn't exist"
        });
      }
      else {
        order.date = body.orderFormData.date;
        order.rsrnDept = body.orderFormData.rsrnDept;
        order.company = body.orderFormData.company;
        order.paidOnCc = body.orderFormData.paidOnCc;
        order.items = body.orderFormData.items;
        order.status = body.orderFormData.status;
        order.onCcBill = body.orderFormData.onCcBill;
        order.completed = body.orderFormData.completed;

        order.save((err, updateOrder) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }
          else {
            return res.send({
              success: true,
              message: updateOrder,
            })
          }
        })
      }
    });
  });

  app.delete('/api/purchaseOrder/delete', (req, res, next) => {
    const { query } = req;
    const { id } = query;

    PurchaseOrder.findOne({
      '_id': id,
    }).remove().exec((err) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      }
      else {
        return res.send({
          success: true
        })
      }
    })
  });

  // USERS

  app.get('/api/users/all', (req, res, next) => {
    User.find({}, (err, user) => {
      if (err){
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      else {
        return res.send({
          success: true,
          message: user,
        })
      }
    });
  });

  app.put('/api/users/update', (req, res, next) => {
    const { query } = req;
    const { id } = query;
    const { body } = req;

    User.findOne({
      '_id': id,
    }, (err, user) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Purchase order doesn't exist"
        });
      }
      else {
        user.firstName = body.user.firstName;
        user.surname = body.user.surname;
        user.alias = body.user.alias;
        user.email = body.user.email;
        user.password = body.user.password;
        user.level = body.user.level;

        user.save((err, updateUser) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }
          else {
            return res.send({
              success: true,
              message: updateUser,
            })
          }
        })
      }
    });
  });

  app.put('/api/users/changePassword', (req, res, next) => {
    const { query } = req;
    const { id } = query;
    const { body } = req;

    User.findOne({
      '_id': id,
    }, (err, user) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Purchase order doesn't exist"
        });
      }
      else {
        user.password = user.generateHash(body.password);

        user.save((err, updateUser) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }
          else {
            return res.send({
              success: true,
              message: updateUser,
            })
          }
        })
      }
    })
  });
};
