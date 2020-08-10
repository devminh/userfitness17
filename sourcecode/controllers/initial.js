var express = require('express');
module.exports = function() {
  var app = express();
  app.set('port', 3000);
  return app;
};

app.use(express.static(__dirname + '/public'));
const mongo = require('mongodb').MongoClient;
const url = 'mongodb+srv://fitness17:123@minhvu-db-met1i.mongodb.net/test?retryWrites=true&w=majority';

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);
console.log("listen on port 3000 !");
