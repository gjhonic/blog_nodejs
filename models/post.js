let db         = require('../my_modules/mydb');
let MyLib      = require('../my_modules/mylib');

class Post {
  id         = '';
  title      = '';
  user_id    = '';
  text_short = '';
  text_full  = '';
  date       = '';

  //Метод сохраняет статью в базу данных
  save(){
    let now = MyLib.NowDate();
    let query = "INSERT INTO post VALUES(null, '"+this.title+"', '"+this.user_id+"', '"+this.text_short+"', '"+this.text_full+"', '"+this.date+"')";

    db.query(query, function (error, results, fields) {
      if (error) throw error;
    });
    console.log("["+now+"] Статья: "+this.title+". Успешно создана!");
    return true;
  }

  //Метод возвращает все статьи
  static findAll(callback){
      let query = "SELECT post.id as id, post.title as title, post.text_short as text_short, post.date as date, user.id as user_id, user.name as author_name, user.surname as author_surname  FROM post  LEFT JOIN user ON post.user_id = user.id ORDER BY id DESC";
      db.query(query, function (error, results, fields) {
        if (error) throw error;
        callback(results)
      });
  }

  //Метод возвращает статью
  static find(post_id, callback){
    let query = "SELECT post.id as id, post.title as title, post.text_full as text_full, post.date as date, user.id as user_id, user.name as author_name, user.surname as author_surname  FROM post LEFT JOIN user ON post.user_id = user.id WHERE post.id="+post_id;
    db.query(query, function (error, results, fields) {
        if (error) throw error;
        callback(results[0])
      });
  }

  //Метод возвращает статьи пользователя
  static findAllUser(user, callback){
      let query = "SELECT * FROM post WHERE user_id="+user+" ORDER BY id DESC";
      db.query(query, function (error, results, fields) {
        if (error) throw error;
        callback(results)
      });
  }

}

module.exports = Post;
