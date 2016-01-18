var express = require('express');
var router = express.Router();
var pg = require('pg')
var states = require('../public/javascripts/states.js')
var cuisineList = require('../public/javascripts/cuisine.js')
require('dotenv').load()

var environment = process.env.NODE_ENV || 'development';

var connectionString = require('../knexfile.js')[environment].connection;

function runQuery (query, callback) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) { done() ; console.log(err); return; }
    client.query(query, function (err, results) {
      done();
      if (err) { console.log(err); return; }
      callback(results);
    });
  });
}

function checkEmpty(obj){
  var tester = false
  for (var e in obj){
    if (obj[e] == "") {
      tester = true
    }
  }
  return tester
}

router.get('/', function(req, res, next) {
  res.redirect('/rests')
});
//all page
router.get('/rests',function(req,res){
  runQuery('select * from rests',function(results){
    res.render('index', {rests:results.rows})
  })
})
//new page
router.get('/rests/new',function(req,res){
  res.render('new', {states:states, cuisineList:cuisineList})
})
//CREATE
router.post('/rests',function(req,res){
  var name = req.body.name.replace(/'/g, "''")
  var location = req.body.location
  var state = req.body.state
  var cuisine = req.body.cuisine
  var rating = req.body.rating
  var image = req.body.image
  var bio = req.body.bio
  if (req.body.submit !== 'cancel'){

    if (checkEmpty(req.body)){
        res.render('new', {states:states, cuisineList:cuisineList, error:true, name:name, location:location, statey:state, cuisiney:cuisine, rating:rating, image:image, bio:bio})
    }else{
      runQuery("insert into rests values(default, '"+name+"', '"+location+"', '"+state+"', '"+cuisine+"', '"+rating+"', '"+image+"', '"+bio+"')",function(results){
        res.redirect('/rests')
      })
    }

  }else{
    res.redirect('/rests')
  }
})
//SHOW
router.get('/rests/:id',function(req,res){
  var id = req.params.id
  runQuery('select * from rests where id = '+id+";",function(results){
    runQuery("select * from reviews where rest_id="+id+";", function(results2){
      res.render('show',{rests:results.rows[0], reviews:results2.rows})
    })
  })
})
//review NEW page
router.get('/rests/:id/review',function(req,res){
  var id = req.params.id
  runQuery("select * from rests where id ="+id+";",function(results){
    res.render('reviews/new',{name:results.rows[0], id:id})
  })
})

//review CREATE
router.post('/rests/:id/review',function(req,res){
  var id = req.params.id
  var name = req.body.name.replace(/'/g, "''")
  var rating = req.body.rating
  var review = req.body.review

  var datey = new Date()
  var datey = datey.toDateString().split(" ")
  datey.shift()
  var datey = datey.join("-")
  if (req.body.submit !== 'cancel'){

    if (checkEmpty(req.body)){
        runQuery("select * from rests where id ="+id+";",function(results){
          res.render('reviews/new', {name:results.rows[0],namey:name,ratingy:rating,reviewy:review,error:true,id:id})
        })
    }else{
      runQuery("insert into reviews values(default,'"+name+"', '"+rating+"','"+review+"','"+datey+"','"+id+"');", function(results){
        res.redirect('/rests')
      })
    }

  }else{
      res.redirect('/rests')
  }
})

//review EDIT page
router.get('/rests/review/:id',function(req,res){
  var id = req.params.id
  runQuery("select reviews.id as reviews_id, reviews.name as reviews_name, reviews.rating as reviews_rating, reviews.review as reviews_review, rests.name as rests_name from reviews inner join rests on reviews.rest_id=rests.id where reviews.id="+id+";",function(results){
      res.render('reviews/edit',{review:results.rows[0]})
  })
})

//review UPDATE
router.post('/rests/review/:id',function(req,res){
  var id = req.params.id
  var name = req.body.name.replace(/'/g, "''")
  var rating = req.body.rating
  var review = req.body.review

  var datey = new Date()
  var datey = datey.toDateString().split(" ")
  datey.shift()
  var datey = datey.join("-")

  if (req.body.submit !== 'cancel'){
    runQuery("update reviews set name='"+name+"', rating='"+rating+"', review='"+review+"',date='"+datey+"' where id="+id+";",function(results){
      res.redirect('/rests')
    })
  }else{
    res.redirect('/rests')
  }
})

//EDIT page
router.get('/rests/:id/edit',function(req,res){
  var id = req.params.id
  runQuery('select * from rests where id = '+id+';', function(results){
    res.render('edit',{rests:results.rows[0], cuisineList:cuisineList,states:states})
  })
})

//UPDATE
router.post('/rests/:id',function(req,res){
  var id = req.params.id + ';'
  var namey = req.body.name.replace(/'/g, "''")
  var location = req.body.location
  var state = req.body.state
  var cuisine = req.body.cuisine
  var rating = req.body.rating
  var image = req.body.image
  var bio = req.body.bio

  if(req.body.submit === 'cancel'){
    res.redirect('/rests')
  }else{
    runQuery("update rests set name='"+namey+"', location='"+location+"', state='"+state+"', cuisine='"+cuisine+"', rating='"+rating+"', image='"+image+"', bio='"+bio+"' where id="+id, function(results){
      res.redirect('/rests')
    })
  }

})

//DELETE
router.get('/rests/:id/delete', function(req,res){
  var id = req.params.id
  runQuery('delete from rests where id ='+id+';', function(results){
    res.redirect('/rests')
  })
})

//ADMIN

//admin all page
router.get('/admin', function(req,res){
  runQuery('select * from rests', function(results){
      res.render('admin', {rests:results.rows})
  })
})

//admin edit page
router.get('/admin/employees/:id/edit', function(req,res){
  var id = req.params.id + ';'
  runQuery("select * from rests inner join employees on rests.id=employees.rest_id where rests.id="+id, function(results){
      runQuery("select * from rests where id="+id,function(results2){
        res.render('employees/edit', {employees:results.rows, name:results2.rows[0].name, restId:req.params.id})
      })
  })
})

//admin new page
router.get('/admin/employees/:id/new', function(req,res){
  var id = req.params.id
  runQuery("select name from rests where id="+id+";", function(results){
    res.render('employees/new',{name:results.rows[0].name, id:id})
  })
})

//admin CREATE
router.post('/admin/employees/:id', function(req,res){
  var id = req.params.id
  var firstname = req.body.firstname
  var lastname = req.body.lastname
  var position = req.body.position
  if (req.body.submit !== 'Cancel'){
    if (checkEmpty(req.body)){
        runQuery("select name from rests where id ="+id+";", function(results){
          res.render('employees/new', {first:firstname, last:lastname, position:position, name:results.rows[0].name, error:true, id:id})
        })
    }else{
        runQuery("insert into employees values(default, '"+id+"', '"+firstname+"', '"+lastname+"', '"+position+"');", function(results){
          res.redirect('/admin')
        })
    }

  }else{
      res.redirect('/admin')
  }
})

//admin DELETE
router.get('/admin/employees/:id/delete', function(req,res){
  var id = req.params.id
  runQuery('delete from employees where id_emp ='+id+';', function(results){
    res.redirect('/admin')
  })
})

module.exports = router;
