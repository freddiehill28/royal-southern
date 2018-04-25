const User = require('../../models/User');

module.exports = (app) => {

  // Sign Up
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
  })
};
