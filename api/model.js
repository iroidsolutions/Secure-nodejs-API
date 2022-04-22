var express = require('express');
var db = require('./db_connection.js'); 
var db = db.connection; 
var Joi = require('joi');
var app = express();
module.exports = {

// Get all users data
check_user: function (req,res) {

	params = req.body.data;
	if(typeof(params.user_id) != "undefined" && params.user_id !==	 null)
	{
//---------- Check valid user ----------//
		var user = getUserData(params.user_id,function(rowcount){
			if(rowcount.length <= 0)
			{
				res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'NOT_FOUND', msg : 'Could not find user'}));
			}
			else
			{
				switch(req.body.api_request){

//---------- get all interests ----------//
	  				  	case 'get_interest':									
								get_interest(req,res,rowcount);
						break;
//---------- Registration of push user ----------//
	  				  	case 'register_for_push':									
								register_for_push(req,res,rowcount);
						break;	
//---------- Logout user ----------//
	  				  	case 'logout_user':									
								logout_user(req,res,rowcount);
						break;												
				}
			}
		});
	}
},

//---------- Login process ----------//
login: function(req,res){

		// console.log(req);
		params = req.body.data;
		const schema = Joi.object().keys({
   		email_id: Joi.string().email().required(),
   		password: Joi.string().required()
   		
		});
		const {error} = Joi.validate(params, schema);
		if(error)
		{
			res.send({flag : 'false',result : 'error',declaration : 'INVALID_INPUT',msg : (error.details[0].message) });			
			return;
		}

		db.query("SELECT * FROM tblusers WHERE email_id ='"+params.email_id+"' AND password ='"+params.password+"'",function(error,row,field){

		if(!!error){
			res.send(JSON.stringify({flag : 'false',result : 'error', msg : 'ERROR'}));
		}
		else
		{
//---------- successfully Login ----------//
			if(row.length > 0)
			{
					var query = get_login_sign_up_response(row);
					res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Logged in Successfully',data : query}));
			}else{

					res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'INVALID_INPUT', msg : 'Invalid email_id or password'}));
			}
						
					
		}
	})
},
//---------- Sign up process ----------//
sign_up: function(req,res){
		params = req.body.data;
		var error = 0;
  		if(typeof(params.first_name) == "undefined" || params.first_name ==	 "")
			{
				error = validator('name');
			}
			
		
		if(error != 0)
		{
			res.send({flag : 'false',result : 'error',declaration : 'INVALID_INPUT',msg : error  });			
			return;
		}
		db.query("SELECT * FROM tblusers WHERE email_id = '"+params.email_id+"'",function(error,row,field){
//---------- Check Unique email_id ----------//		
			if(!row.length)
			{

					db.query("INSERT INTO tblusers SET ? ",params,function(error,row,field){
		
					if(!!error){
						res.send(JSON.stringify({flag : 'false',result : 'error', msg : 'ERROR'}));
					}
					else
					{
//---------- successfully sign_up ----------//
						db.query("SELECT * FROM tblusers WHERE user_id = "+row.insertId,function(error,row,field){
						var query = get_login_sign_up_response(row);
						if(row.length > 0)
						{
								
								res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Sign Up Successfully',data : query}));
						}else{
		
								res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'INVALID_INPUT', msg : 'Sign up Fail'}));
						}
						});
								
					}
				})	
			}else{
					res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'DENIED', msg : 'EmailId Already in Use. Please Try another EmailId'}));
			}

		})
},
//---------- Social login process ----------//
social_login: function(req,res){
		params = req.body.data;
		var error = 0;
  		if(typeof(params.first_name) == "undefined" || params.first_name ==	 "")
			{
				error = validator('name');
			}
		if(typeof(params.social_id) == "undefined" || params.social_id =="")
			{
				error = validator('social_id');
			}
		if(typeof(params.social_type) == "undefined" || params.social_type == "")
			{
				error = validator('social_type');
			}

		if(error != 0)
		{
			res.send({flag : 'false',result : 'error',declaration : 'INVALID_INPUT',msg : error  });			
			return;
		}
//---------- Check if social account is exist  ----------//		
		db.query("SELECT * FROM tblusers WHERE social_id = '"+params.social_id+"'",function(error,row,field){

			if(!row.length)
			{

					db.query("INSERT INTO tblusers SET ? ",params,function(error,row,field){
		
					if(!!error){
						res.send(JSON.stringify({flag : 'false',result : 'error', msg : 'ERROR'}));
					}
					else
					{
//---------- successfully sign_up with social login ----------//
						db.query("SELECT * FROM tblusers WHERE user_id = "+row.insertId,function(error,row,field){
						var query = get_social_login_response(row);
						if(row.length > 0)
						{
								
								res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Sign Up Successfully',data : query}));
						}else{
		
								res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'INVALID_INPUT', msg : 'Sign up Fail'}));
						}
						});
								
					}
				})	
			}else{
					db.query("UPDATE tblusers SET ? WHERE social_id = "+params.social_id,params,function(error,row,field){
		
					if(!!error){
						res.send(JSON.stringify({flag : 'false',result : 'error', msg : 'ERROR'}));
					}
					else
					{
//---------- successfully sign_up with social login----------//
						db.query("SELECT * FROM tblusers WHERE social_id = "+params.social_id,function(error,row,field){
						var query = get_social_login_response(row);
						if(row.length > 0)
						{
								
								res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Sign Up Successfully',data : query}));
						}else{
		
								res.send(JSON.stringify({flag : 'false',result : 'error',declaration : 'INVALID_INPUT', msg : 'Sign up Fail'}));
						}
				    });								
				}
			})	
		}
	})
}

};
//---------- validate required field ----------//
function validate(user_id)
{
	var schema = Joi.string().required();
	return Joi.validate(user_id,schema);
}

//---------- Check valid user ----------//
function getUserData(user_id,callback)
{
		db.query("SELECT * FROM tblusers WHERE user_id = "+user_id,function(error,row,field){
		
		if(!!error){
			return 0;	
		}
		else
		{	
			return callback(row);	
		}

	})
		
}
//---------- get all interests ----------//
function get_interest(req,res,user)
{
	db.query("SELECT * FROM tblinterest",function(error,row,field){

		if(!!error){
			console.log("Something went wrong!");
		}
		else
		{
			console.log("Successful query\n");			
			var user_interest  = user[0].interest.split(",");			
			var results = [];
			var config = row;			
			for (var key in config) {
				interest = config[key].interest_id;
				var query = {			    	
			    	'interest_id' : config[key].interest_id,
			    	'interest_title' : config[key].title,
			    	'is_interested':(user_interest.indexOf(interest.toString()) != '-1') ? '1' : '0'
			    	};
			    
			    results.push(query);			   
			}
			res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Get Interests Successfully',data : results}));
			
		}
	})
}
//---------- Registration of push user ----------//
function register_for_push(req,res,user)
{
	params = req.body.data;
		const schema = Joi.object().keys({
		user_id: Joi.string().required(),
   		device_id: Joi.string().required(),
   		device_type: Joi.string().required(),
   		device_token: Joi.string().required(),
   		certificate_type: Joi.string().required()
   		
		});
		const {error} = Joi.validate(params, schema);
		if(error)
		{
			res.send({flag : 'false',result : 'error',declaration : 'INVALID_INPUT',msg : (error.details[0].message) });			
			return;
		}	

	db.query("SELECT * FROM tblpush_user WHERE user_id = "+params.user_id+" AND device_type = '"+params.device_type+"'",function(error,row,field){

			if(row.length > 0){

				db.query("DELETE FROM tblpush_user WHERE user_id = "+params.user_id+" AND device_type = '"+params.device_type+"'");

			}
			db.query("INSERT INTO  tblpush_user SET ?",params,function(error,row,field){

				if(!!error){
					console.log("Something went wrong!");
				}
				else
				{			
					res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Registrer for push successfully'}));
				}
			})
	})
}
//---------- Logout user ----------//
function logout_user(req,res,user)
{
	params = req.body.data;
		const schema = Joi.object().keys({
		user_id: Joi.string().required(),   		
   		device_type: Joi.string().required()
   		});
		const {error} = Joi.validate(params, schema);
		if(error)
		{
			res.send({flag : 'false',result : 'error',declaration : 'INVALID_INPUT',msg : (error.details[0].message) });			
			return;
		}	

	db.query("SELECT * FROM tblpush_user WHERE user_id = "+params.user_id+" AND device_type = '"+params.device_type+"'",function(error,row,field){

			if(row.length > 0){

				db.query("DELETE FROM tblpush_user WHERE user_id = "+params.user_id+" AND device_type = '"+params.device_type+"'");

			}			
					res.send(JSON.stringify({flag : 'true',result : 'success', msg : 'Logged Out Successfully'}));				
	})
	
}

//---------- Get response of login and sign_up service ----------//
function get_login_sign_up_response(row){

	for (var key in row) {
		    var query = {
		    	'user_id' : row[key].user_id,
		    	'first_name'  : row[key].first_name,
		    	'last_name' : row[key].last_name,
		    	'email_id'  : row[key].email_id,
		    	'is_first_time_login' : row[key].is_first_time_login,
		    	'created_at' : row[key].created_at,
		    	'updated_at'  : row[key].updated_at,		    	 
		    	} ;		    
		}

		return query;
}

//---------- Get response of social login service ----------//
function get_social_login_response(row){

	for (var key in row) {
		    var query = {
		    	'user_id' : row[key].user_id,
		    	'first_name'  : row[key].first_name,
		    	'last_name' : row[key].last_name,
		    	'social_id'  : row[key].social_id,
		    	'social_type'  : row[key].social_type,
		    	'email_id'  : row[key].email_id,
		    	'social_profile_pic'  : row[key].social_profile_pic,
		    	'is_first_time_login' : row[key].is_first_time_login,		    		 
		    	} ;		    
		}

		return query;
}
//---------- validation for empty string or undefined string ----------//
function validator(key)
{	
	var error = "Invalid or missing "+key;
	console.log(error);
	return error; 
}