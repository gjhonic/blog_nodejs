let express    = require('express');
let bodyParser = require('body-parser');
let db         = require('./my_modules/mydb');
let User       = require('./models/user');
let Post       = require('./models/post');
let MyApp      = require('./my_modules/myapp');
let MyLib      = require('./my_modules/mylib');
let path = require("path");

let app = express();
app.use(express.static(path.join(__dirname, 'src')));

let myapp = new MyApp();
let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');
app.use('/public',express.static('public'));


//Главная страница >>>
app.get('/index', function (req, res) {
  res.render('index');
});
app.get('/', function (req, res) {
  res.render('index');
});
//<<<

// - - - - - - - - - Вход/Регистрация - - - - - - - - -

//Страница аутентификации >>>
app.get('/signin', function (req, res) {
  if(myapp.user != null){
    res.redirect("/me");
  }else{
    res.render('signin');
  }
});
//Метод аутентификации пользователя
app.post('/signin', urlencodedParser, function (req, res) {
  let now = MyLib.NowDate();
  if(!req.body) return res.sendStatus(400)
  if(!req.body.username && !req.body.password){
    res.render('signin', {notice: 'Не верный логин или пароль!'});
  }

  myapp.user = User.find(req.body.username, function(fuser) {
    if (fuser!=null){
      if(fuser.password == req.body.password){
        console.log("["+now+"] Пользователь: "+fuser.username+". Успешно вошел!");
        myapp.user = fuser;
        res.redirect("/me");
      }else{
        console.log("["+now+"] Произошла ошибочка при аутентификации");
        res.render('signin', {notice: 'Не верный логин или пароль!'});
      }
    }else{
      console.log("["+now+"] Произошла ошибочка при аутентификации");
      res.render('signin', {notice: 'Не верный логин или пароль!'});
    }
  });
});

//Отображение страницы register
app.get('/register', function (req, res) {
  res.render('register');
});
//Метод регистрации пользователя
app.post('/register', urlencodedParser, function (req, res) {
  let now = MyLib.NowDate();
  if(!req.body) return res.sendStatus(400)

  let user = new User();
  user.name = req.body.name;
  user.surname = req.body.surname;
  user.username = req.body.username;
  user.password = req.body.password;

  if(user.save()){
    myapp.user = user;
    res.redirect('/me');
  }else{
    res.render('register', {notice: 'Ошибка регистрации!'});
  }
});

//Выход из системы
app.get('/signout', function (req, res) {
  let now = MyLib.NowDate();
  console.log("["+now+"] Пользователь: "+myapp.user.username+". Успешно вышел!");
  myapp.signout();
  res.redirect("/index");
});
// - - - - - - - - - - - - - - - - - - - - - -

//Отображение страницы me (лк пользователя)
app.get('/me', function (req, res) {
  if(myapp.user == null){
    res.redirect("/signin");
  }
  res.render('me', {user: myapp.user});
});


// - - - -  - - - - - -  Методы для работы с постами - - -  - - - -  -
//Отображение страницы add-post
app.get('/add-post', function (req, res) {
  if(myapp.user == null){
    res.redirect("/signin");
  }
  res.render('add-post', {user: myapp.user});
});
// POST /add-post gets urlencoded bodies
app.post('/add-post', urlencodedParser, function (req, res) {
  let now = MyLib.NowDate();
  if(myapp.user == null){
    res.redirect("/signin");
  }

  if(!req.body) return res.sendStatus(400)

  let post = new Post();
    post.title = req.body.title;
    post.user_id = myapp.user.id;
    post.text_short = req.body.short_text;
    post.text_full = req.body.full_text;
    post.date = now;

  if(post.save()){
    res.redirect('/me');
  }else{
    res.render('/add-post', {notice: 'Ошибка создания поста!'});
  }

});

//Отображение постов пользователя
app.get('/my-posts', function (req, res) {
  if(myapp.user == null){
    res.redirect("/signin");
  }
  let posts = Post.findAllUser(myapp.user.id, function(results){
    res.render('my-posts', {posts: results, user: myapp.user});
  });
});

//Отображение всех постов
app.get('/posts', function (req, res) {
  if(myapp.user == null){
    res.redirect("/signin");
  }
  let posts = Post.findAll(function(results){
    res.render('posts', {posts: results, user: myapp.user});
  });
});

//Отображение всех постов
app.get('/post', function (req, res) {
  if(myapp.user == null){
    res.redirect("/signin");
  }
  let post_id = req.query.id;
  if(post_id==null){
    res.redirect("/posts");
  }
  let posts = Post.find(post_id, function(results){
    res.render('post', {post: results});
  });
});

//Форма изменения поста
app.get('/update-post', function (req, res) {
  let now = MyLib.NowDate();
  if(myapp.user == null){
    res.redirect("/signin");
  }
  let post_id = req.query.id;
  if(post_id==null){
    res.redirect("/posts");
  }
  let post = Post.find(post_id, function(results){
    if(results.user_id == myapp.user.id){
      res.render('update-post', {post: results});
    }else{
      console.log("["+now+"] Пользователь: "+myapp.user.username+". Хотел изменить не свою статью!");
    }
  });
});
// Метод сохранения изменения
app.post('/update-post', urlencodedParser, function (req, res) {
  let now = MyLib.NowDate();
  if(myapp.user == null){
    res.redirect("/signin");
  }

  if(!req.body) return res.sendStatus(400)

  Post.find(req.body.post_id, function(results){
    if(results.user_id == myapp.user.id){
      post = new Post();
      post.id = results.id;
      post.title = req.body.title;
      post.user_id = results.user_id;
      post.text_short = req.body.short_text;
      post.text_full = req.body.full_text;
      post.date = results.date;
      if(post.update()){
        res.redirect('/post?id='+post.id);
      }else{
        console.log("["+now+"] Ошибка изменения поста!");
        res.render('/update-post', {notice: 'Ошибка изменения поста!'});
      }
    }else{
      console.log("["+now+"] Пользователь: "+myapp.user.username+". Хотел изменить не свою статью!");
    }
  });

});

app.listen(3002);
console.log("Server Active ...");
