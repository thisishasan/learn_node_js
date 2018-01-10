const express = require('express');
const router = express.Router();

let Article = require('../models/article');

router.get('/add',function(req,res){
  res.render('add_article',{
    title: "Add Article"
  });
});


router.get('/edit/:id',function(req,res){
  Article.findById(req.params.id,function(err, article){
    res.render('edit_article',{
      title: "Edit Article",
      article : article
    });
  });
});

router.post('/edit/:id',function(req,res){
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
      req.flash('success','Article Updated.');
      res.redirect('/');
    }
  });
});

router.post('/add',function(req,res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
      errors : errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        req.flash('success','Article Added.');
        res.redirect('/');
      }
    });
  }


});

router.get('/:id',function(req,res){
  Article.findById(req.params.id,function(err, article){
    res.render('article',{
      article : article
    });
  });
});


router.delete('/:id',function(req, res){
  let query = {_id: req.params.id };
  Article.remove(query, function(err){
    if(err){
      console.log(err);
      return;
    }
    res.send("Success");
  });
});

module.exports = router;
