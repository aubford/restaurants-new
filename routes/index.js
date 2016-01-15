var express = require('express');
var router = express.Router();
var pg = require('pg')
var states = require('../public/javascripts/states.js')
var cuisineList = require('../public/javascripts/cuisine.js')
require('dotenv').load()

var connectionString = process.env.DATABASE_URL || 'postgres://localhost/restaurants';

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

/* GET home page. */
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
  var name = req.body.name
  var location = req.body.location
  var state = req.body.state
  var cuisine = req.body.cuisine
  var rating = req.body.rating
  var image = req.body.image
  var bio = req.body.bio

  if (req.body.submit !== 'cancel'){
    runQuery("insert into rests values(default, '"+name+"', '"+location+"', '"+state+"', '"+cuisine+"', '"+rating+"', '"+image+"', '"+bio+"')",function(results){
    })
  }
    res.redirect('/rests')
})
//READ
router.get('/rests/:id',function(req,res){
  var id = req.params.id
  runQuery('select * from rests where id = '+id+';',function(results){
    res.render('show',{rests:results.rows[0]})
  })
})
//edit page
router.get('/rests/:id/edit',function(req,res){
  var id = req.params.id

  runQuery('select * from rests where id = '+id+';', function(results){
    console.log(results.rows[0])
    res.render('edit',{rests:results.rows[0], cuisineList:cuisineList,states:states})
  })
})

//UPDATE
router.post('/rests/:id',function(req,res){
  var id = req.params.id
  var namey = req.body.name
  var location = req.body.location
  var state = req.body.state
  var cuisine = req.body.cuisine
  var rating = req.body.rating
  var image = req.body.image
  var bio = req.body.bio

  runQuery("update rests set name='"+namey+"', location='"+location+"', state='"+state+"', cuisine='"+cuisine+"', rating='"+rating+"', image='"+image+"', bio='"+bio+"' where id='"+id+"';",
    function(results){
    res.redirect('/rests')
    })
})
//DELETE
router.post('/rests/:id/delete', function(req,res){
  var id = req.params.id
  runQuery('delete from rests where id ='+id+';', function(results){
    res.redirect('/rests')
  })
})
//ADMIN
router.get('/admin', function(req,res){
  runQuery('select * from rests',function(results){
    runQuery('select * from employees',function(resultsE){
      res.render('admin', {rests:results.rows, employees:resultsE.rows})
    })
  })
})

module.exports = router;
