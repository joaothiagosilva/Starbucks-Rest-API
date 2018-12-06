var exports = module.exports;

var greeter   = require('../models/greeter');

var apiserver = '54.176.179.159';


exports.loginForm = function(req, res) {

  var name = req.query.name || "";
  var error=req.query.error;
  var context = "";
  var sessData = req.session;
  var id = sessData.id;
  var username = sessData.name;
  
  if (!id.trim()) {
	  context = {
				siteTitle: "Welcome"
				  , welcomeMessage: greeter.welcomeMessage(username)
				  ,pageDescr: "Welcome to the Starbucks Online Store"
			  };
			 
  } else {
	  context = {
				siteTitle: "Login Form"
				  , welcomeMessage: greeter.welcomeMessage(name)
				  ,pageDescr: "Let's login to go further"
				  ,error: error
			  };
  }
  
  var template = __dirname + '/../views/loginForm';
  res.render(template, context);

};

exports.loginSubmit = function(req, res) {

	const http = require('http');
	const querystring = require('querystring'); 

	//req - the nodejs request from UI
	var name=req.body.username;
	var password=req.body.password; 
	  
	var postData = querystring.stringify({
	      'name' : name,
	      'password' : password
	  });

	  var options = {
	    hostname: apiserver,
	    port: 3000,
	    path: '/login',
	    method: 'POST',
	    headers: {
	         'Content-Type': 'application/x-www-form-urlencoded',
	         'Content-Length': postData.length
	       }
	  };
	  
	  //data - the go api return data
	  var data='';
	  //req2 - the outgoing request to go api 
	  var req2 = http.request(options, (res2) => {
	    console.log('statusCode:', res2.statusCode);
	    console.log('headers:', res2.headers);

		  // A chunk of data has been recieved.
		  res2.on('data', (chunk) => {
		    data += chunk;
		  });
		  // The whole response has been received. Print out the result.
		  res2.on('end', () => {
			 console.log(data);
		     console.log(data.length);
		     //console.log(name);
		     //console.log(password);
		    
		     var jdata=JSON.parse(data);
		     if(jdata.hasOwnProperty('error')){
		    	 res.redirect('/login?error='+jdata.error);
           	 }
             else {
            	 var sessData = req.session;
            	  sessData.id=jdata._id
            	  sessData.name = jdata.name;
            	  console.log(sessData.id);
            	  console.log(sessData.name);
            	 res.redirect('/mycards');
			  }
		  });
	  });
	  req2.on('error', (e) => {
	    console.error(e);
	  }); 
	  req2.write(postData);
	  //req2.end();	  
	};

	
	exports.signupSubmit = function(req, res) {

		const http = require('http');
		const querystring = require('querystring'); 

		//req - the nodejs request from UI
		var name=req.body.username;
		var password=req.body.password; 
		  
		var postData = querystring.stringify({
		      'name' : name,
		      'password' : password
		  });

		  var options = {
		    hostname: apiserver,
		    port: 3000,
		    path: '/signup',
		    method: 'POST',
		    headers: {
		         'Content-Type': 'application/x-www-form-urlencoded',
		         'Content-Length': postData.length
		       }
		  };
		  
		  //data - the go api return data
		  var data='';
		  //req2 - the outgoing request to go api 
		  var req2 = http.request(options, (res2) => {
		    console.log('statusCode:', res2.statusCode);
		    console.log('headers:', res2.headers);

			  // A chunk of data has been recieved.
			  res2.on('data', (chunk) => {
			    data += chunk;
			  });
			  // The whole response has been received. Print out the result.
			  res2.on('end', () => {
				 console.log(data);
			     console.log(data.length);
			     //console.log(name);
			     //console.log(password);
			    
			     var jdata=JSON.parse(data);
			     if(jdata.hasOwnProperty('error')){
			    	 res.redirect('/login?error='+jdata.error);
			     } else {
			    	 res.redirect('/login?error=Success!Please login with your new user id'); 
			     }
			    
			  });

		  });

		  req2.on('error', (e) => {
		    console.error(e);
		  }); 
		  
		  req2.write(postData);
		  //req2.end();	  
		  
		};	
	

