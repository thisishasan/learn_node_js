const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open',function(){
  console.log("Database connected!");
});

db.on('err',function(){
  console.log(err);
});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

let Article = require('./models/article');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'public')))


app.get('/',function(req, res){
Article.find({},function(err,articles){
  if(err){
    console.log(err);
  }else{
    res.render('index',{
      title: "Articles",
    articles: articles
  });
  }
});

});

app.get('/articles/add',function(req,res){
  res.render('add_article',{
    title: "Add Article"
  });
});

app.get('/article/:id',function(req,res){
  Article.findById(req.params.id,function(err, article){
    res.render('article',{
      article : article
    });
  });
});

app.get('/articles/edit/:id',function(req,res){
  Article.findById(req.params.id,function(err, article){
    res.render('edit_article',{
      title: "Edit Article",
      article : article
    });
  });
});

app.post('/articles/edit/:id',function(req,res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  console.log(article);
  let query = {_id : req.params.id };
  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  });
});

app.post('/articles/add',function(req,res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  article.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      res.redirect('/');
    }
  });
});

app.delete('/article/:id',function(req, res){
  let query = {_id: req.params.id };
  Article.remove(query, function(err){
    if(err){
      console.log(err);
      return;
    }
    res.send("Success");
  });
});



app.listen(3000,function(){
  console.log("Server started on port 3000..");
});
