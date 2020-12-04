let db         = require('../my_modules/mydb');
let MyLib      = require('../my_modules/mylib');

class User {
  id       = '';
  name     = '';
  surname  = '';
  password = '';
  username = '';

  validate(){
    if((this.surname != '') && (this.name != '') && (this.password != '') && (this.username !='')){
      return true;
    }else{
      return false;
    }
  }

  save(){
    let now = MyLib.NowDate();
    if(this.validate()){
      let query = "INSERT INTO user VALUES(null, '"+this.name+"', '"+this.surname+"', '"+this.username+"', '"+this.password+"')";

      db.query(query, function (error, results, fields) {
        if (error) throw error;
      });
      console.log("["+now+"] Пользователь: "+this.username+". Успешно зарегистрировался");
      return true;
    }else{
      return false;
    }
  }

  static find(username, callback){
    let query = "SELECT * FROM user WHERE username='"+username+"'";

    db.query(query, function (error, results, fields) {
      if (error) throw error;

      if(results[0].name!=null){
        let fuser = new User();
        fuser.id   = results[0].id;
        fuser.name = results[0].name;
        fuser.surname = results[0].surname;
        fuser.username = results[0].username;
        fuser.password = results[0].password;
        callback(fuser);
      }
      else{
        callback();
      }
    });
  }
}
module.exports = User;
