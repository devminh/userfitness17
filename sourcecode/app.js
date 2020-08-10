var express = require("express");
  var app = express();

app.use(express.static("public"));

app.use(express.static(__dirname + '/public'));

const mongo = require('mongodb').MongoClient;
const url = 'mongodb+srv://fitness17:123@minhvu-db-met1i.mongodb.net/test?retryWrites=true&w=majority';

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]


var session = require('express-session');
app.use(session({

	secret: 'secret',
	resave: true,
	saveUninitialized: true,

}));


var bodyParser = require('body-parser');
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


var reply = require("./controllers/reply.js");
reply(app,mongo,url);

//sign-up verify
var signup = require("./controllers/signup.js");
signup(app,mongo,url);

//sign-in verify + sign-in page
var signin = require("./controllers/signin.js");
signin(app,mongo,url);

//show bloglist
var bloglist = require("./controllers/bloglist.js");
bloglist(app,mongo,url);


var giahankhoahoc = require("./controllers/giahankhoahoc.js");
giahankhoahoc(app,mongo,url);

//show a blog
var showblog = require("./controllers/showblog.js");
showblog(app,mongo,url);



var changeprofile = require("./controllers/changeprofile.js");
changeprofile(app,mongo,url);

//show course,enroll course
var course = require("./controllers/course.js");
course(app,mongo,url);

var thanhtich = require("./controllers/thanhtich.js");
thanhtich(app,mongo,url);

var rutlui = require("./controllers/rutlui.js");
rutlui(app,mongo,url);

app.get("/signup", function(request, response)  {
    response.render("signup",{loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email} );
});
app.get('/', function(request, response) {
      response.render("homepage",{loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email} );
});

app.get('/aboutus', function(request, response) {
      response.render("aboutus",{loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email} );
});




app.get("/phanhoi", function(request, response)  {

    response.render("reply",mysession);
});




app.get("/logout", function(request, response)  {

  request.session.loggedin = false;
  request.session.email = "";
  request.session.hoten = "";
  request.session.vitri = "";
  response.redirect('/');

});
