var express = require('express');
var router = express.Router();
var pg = require('pg')
var states = require('../public/javascripts/states.js')
var cuisineList = require('../public/javascripts/cuisine.js')
require('dotenv').load()
var request = require('request')


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


var my_key = '&key=' + 'AIzaSyBWHslvJ4xsQrljwVEgg_cn6z3W-TqMYq0'
var google_api = 'https://maps.googleapis.com/maps/api/geocode/json?address='


router.get('/',function(req,res){
  var output = []
  runQuery("select * from neighborhoods",function(results){
    res.render('neighborhoods/index',{locations:results.rows})
  })
})

router.get('/new',function(req,res){
  res.render('neighborhoods/new')
})


router.post('/', function(req,res){
  var epicenter = req.body.epicenter.split(" ").join("+")
  var name = req.body.name

  request(google_api+epicenter+"+denver+colorado"+my_key, function (error, response, body) {

      if (!error && response.statusCode == 200) {
        var jase = JSON.parse(body);
        var lat_long = jase.results[0].geometry.location
        var lat = Number(lat_long.lat)
        var lng = Number(lat_long.lng)
        var addy = jase.results[0].formatted_address
        var addy = addy.trim().split(",")
        addy.pop()
        addy.shift()
        var addy = addy.join(',').toLowerCase()
        if (req.body.submit!=='cancel'){
          runQuery("insert into neighborhoods values(default,'"+name+"', '"+lat+"','"+lng+"','"+addy+"');",function(results){
          })
        }
          res.redirect('/neighborhoods')
      }
  })
})


router.get('/:id', function(req,res){
  var id = req.params.id

  runQuery("select * from neighborhoods where id="+id,function(results){
  var r = results.rows[0]
  console.log(r)
  res.render('neighborhoods/show', {name:r.name,lat:r.lat,lng:r.lng,addy:r.address})
  })
})


module.exports = router
