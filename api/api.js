var express = require('express');
var db = require('./db_connection.js'); 
var db = db.connection; 
var bodyParser = require('body-parser');
var common = require('./model.js');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});

app.post('/action',function(req,res,next){
	var params = req.body;
	console.log(req.body);
	var count;
    db.query("SELECT * FROM `api_mst` WHERE api_id='"+params.api_id+"' AND api_secret='"+params.api_secret+"'",function(error,row,field){
  	  		count = row.length;
	  		is_valid(count);
	  	
	  });

	  	function is_valid(count){

	  		if(count > 0)
	  		{
	  			var request = params.api_request;
	  				
	  				if(request == 'get_interest' || request == 'register_for_push' || request == 'logout_user' )
	  				{
//---------- Check valid user ----------//
	  					common.check_user(req,res);
	  				}
	  				else if(request == 'login')
	  				{
//---------- Login process ----------//
	  					common.login(req,res);
	  				}
	  				else if(request == 'sign_up')
	  				{
//---------- sign_up process ----------//
	  					common.sign_up(req,res);
	  				}
	  				else if(request == 'social_login')
	  				{
//---------- social_login process ----------//
	  					common.social_login(req,res);
	  				}	  				
	  		}
	  			
	  		else
	  		{
	  			res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'API_ERROR',msg : "Bad Api User or Secret"}));
	  		}
	  	}
	
});
app.listen(5000);