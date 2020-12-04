let db         = require('./mydb');
let User       = require('../models/user');

class MyApp {
  user = null;

  signout(){
    this.user = null;
    return false;
  }
}
module.exports = MyApp;
