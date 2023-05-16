var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');	
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var fs = require('fs');
var app = express();
app.use( bodyParser.json() )
app.use(cookieParser());
app.use(morgan('combined'));
var session = require('express-session');


// path to the database
var con = require('./connection').con;
// const {Pool} = require('pg');




// const con = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'voting',
//     password: 'developer360',
//     port: 5432, // default PostgreSQL port
//   });


const myFunction = require('./otp');

// addding session:::
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
	secret: "sdkfnsdknfskdnksdnsnkdgskgnlsdngldsdn",
	saveUninitialized: true,
	cookie : {maxAge:oneDay},
	resave: false,
}));







// path to public folders::::
app.use(express.static(path.join(__dirname,'public')));


// set the view engine to ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine','ejs');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



var ejs = require('ejs');
// admin pages



// helperFunctions::
var helperFunctions = require('./helperFunctions');
const isAdmin = helperFunctions.isAdmin;

// path to axios:::
const axiosRequest = require('./otp'); // assuming the above code is saved in a file called axiosRequest.js



// testing for db connection:::
app.get('/test_db',function(req,res){
	// con.query("SELECT * FROM nida",function(err,result) {
	// 	if (err) throw err;
	// 	else{
	// 		res.send(result.rows);
	// 	}
	// })

var otp = req.body.otp_no
console.log('--------------')
otp();
res.send('check console');


});











// Admin first page
app.get('/adminSign',function(req,res){
	res.render('admin/adminSign.ejs');
});


// admin sign in page
app.post('/admin_sign_Page',function(req,res){
	 res.render('admin/adminLogin.ejs');	
});

// admin sigin post
app.post('/admin_sign_Post',function(req,res){
	// get the values:::
	admin_Email = req.body.admin_Email;
	admin_Password = req.body.admin_Password;
    


// cheking if values exist in db:::
con.query("SELECT * FROM admin WHERE email=$1 AND password=$2",[admin_Email,admin_Password],function(err,result) {
		if (err) throw err;
		
		else{
			if(result.rows.length > 0){
				// set the session:::
				req.session.admin = admin_Email;
				req.session.admin_Password = admin_Password;
				console.log(req.session.admin);

			

			 res.redirect('adminDashboard')
			}else{
				res.redirect(307,'admin_sign_Page');
			}

		}
	});

});


// Admin dashboard page
app.get('/adminDashboard' ,isAdmin,function(req,res){
	res.render('admin/adminDashboard.ejs');
});

// logout
app.get('/admin_logout',function(req,res){
	req.session.destroy();
	res.redirect('/adminSign');
});


// admin change session::
app.get('/admin_change_session',isAdmin,function(req,res){
	//query from database::
	 con.query("SELECT * FROM session",function(err,result) {
 	if (err) throw err;
	 	else{
	 		if(result.rows.length > 0){
				console.log(result.rows[0].status)
	 			res.render('admin/admin_Change_session.ejs',{session:result.rows[0].status});
			}
	 	}
	 });

});

// admin change session POST::
app.post('/admin_change_session_POST',function(req,res){
	
// Get the value of SESSION:::
current_session = req.body.current_session;
console.log(current_session);


//creating a sample object:::

var tempSession = [];
if (current_session == 'REGISTRATION') {
	tempSession = {
		"status": "VOTING"
	}
}else{
	tempSession = {
		"status": "REGISTRATION"
	}
}

// update the database:::

con.query("UPDATE session set status =$1 WHERE id = '1'",[tempSession.status],function(err,result) {
	if (err) throw err;
	
	else{
		res.redirect('admin_change_session');
	}
});

});


//admin add candidates::
app.get('/admin_add_candidates',isAdmin,function(req,res){
	res.render('admin/admin_Add_candidates.ejs');
});


//admin add candidates post:::
app.post('/admin_add_candidates_post',function(req,res){
	candidate_First_Name = req.body.candidate_First_Name
	candidate_Last_Name = req.body.candidate_Last_Name
	candidate_Party_Name = req.body.candidate_Party_Name
	candidate_profile = req.body.candidate_profile


// pushing to database::::

	//Add to db::
	con.query("INSERT INTO candidates (firstname,lastname,party,profile) VALUES ($1,$2,$3,$4)",[candidate_First_Name,candidate_Last_Name,candidate_Party_Name,candidate_profile],function(err,result) {
		if (err) throw err;
		else{
			res.redirect('admin_add_candidates');			
		}
	});


	
});



//admin add voters::
app.get('/admin_add_voters',isAdmin,function(req,res){
	res.render('admin/adminRegisterVoters.ejs');
});


//admin add candidates post:::
app.post('/admin_add_voters_post',function(req,res){
	voter_regno = req.body.Registration_number
voter_Department = req.body.Department
	voter_phonenumber = req.body.Phonenumber


// pushing to database::::

	//Add to db::
	con.query("INSERT INTO voters (regno,department,phonenumber) VALUES ($1,$2,$3)",[voter_regno,voter_Department,voter_phonenumber],function(err,result) {
		if (err) throw err;
		else{
			res.redirect('admin_add_voters');			
		}
	});


	
});


//user home page:::
app.get('/',function(req,res){
	res.render('user/userHome.ejs');
});

// user enter nida page
app.post('/user_Enter_NIDA',function(req,res){

//check from db::
con.query("SELECT * FROM session",function(err,result) {
	if (err) throw err;
	else{
		var STATUS = result.rows[0].status;

		if (STATUS == 'VOTING') {
			res.render('user/userEnterNida.ejs');
		}else{
			res.render('user/vote_not_active.ejs');
		}

       
	}


});




});


app.post('/user_NIDA_verify',function(req,res){
	// get the values:::
	user_NIDA = req.body.NIDAno;
	// cheking if values exist in db:::
	con.query("SELECT * FROM nida WHERE nin=$1",[user_NIDA],function(err,result) {
		if (err) throw err;
		else{
			if(result.rows.length > 0){
		
                mynum = '+255'+ result.rows[0].phonenumber;
				console.log(mynum);


            const myFunction = require('./otp')
			myFunction(mynum);

				
               

			 res.redirect('/userVerify_NIDA');
			
			}else{
				res.redirect(307,'user_Enter_NIDA');
			
			}

		}
	});

});

//userVerify_NIDA
app.get('/userVerify_NIDA',function(req,res){
	res.render('user/userVerify_NIDA.ejs');
});



// user_voting_page
app.get('/user_voting_page',function(req,res){

//check from db::
con.query("SELECT * FROM session",function(err,result) {
	if (err) throw err;
	else{
		var STATUS = result.rows[0].status;

		if (STATUS == 'VOTING') {
			res.redirect('/user_Enter_NIDA');
		}else{
			res.render('user/vote_not_active.ejs');
		}

       
	}


});
});


//candidates page::
app.get('/candidates',function(req,res){
	con.query('SELECT profile, firstname, lastname, party FROM candidates', (error, result) => {
		if (error) throw error;
		else{
			if(result.rows.length > 0){

				const candidates = result.rows;
		res.render('user/candidates.ejs', { candidates: candidates });
			}
		}
	  });

});













var port = 3000;
app.listen(3000, function () {
  console.log(`app listening on port ${port}!`);
});