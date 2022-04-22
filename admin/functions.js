var express = require('express');
var db = require('../api/db_connection.js'); 
var db = db.connection; 
var Joi = require('joi');
var app = express();
module.exports = {


add_weblink: function (req,res) {

	params = req.body;

	db.query("INSERT INTO `tblweblinks` SET ?",params,function(error,row,field){

		db.query("SELECT * FROM `tblweblinks`",function(error,row,field){

			// console.log(row);
			  res.render('test',{data: row})

		})
  	  

	  });
	
	}
}