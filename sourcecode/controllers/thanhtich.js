module.exports = function (app,mongo,url){
app.get("/thanhtichbycourse/:courseid", function(request, response)  {
  var courseid = request.params.courseid;
  var ObjectID=require('mongodb').ObjectID;

  if(request.session.loggedin===undefined){
    response.send('Vui lòng đăng nhập  !');
  }
  else{
    var ObjectID=require('mongodb').ObjectID;

    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }

      const db = client.db('fitness17');

      const thanhtich = db.collection('thanhtich');

      thanhtich.find({
        $query: {"useremail":request.session.email,
                "courseid":ObjectID(courseid)},


      }).sort({"sttbuoi": 1}).toArray(
        function(err,result){
          if (err) throw err;

          response.render("thanhtichbycourse",{thanhtich:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );


        }


      )


    })

  }

});


app.get("/tongquanthanhtich", function(request, response)  {


  if(request.session.loggedin===undefined){
    response.send('Vui lòng đăng nhập  !');
  }
  else{
    var ObjectID=require('mongodb').ObjectID;

    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }

      const db = client.db('fitness17');

      const thanhtich = db.collection('thanhtich');

      thanhtich.find({
        $query: {"useremail":request.session.email},


      }).sort({"datecreated": -1}).toArray(
        function(err,result){
          if (err) throw err;

          response.render("tongquanthanhtich",{thanhtich:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );
        }

)
  })

  }

});


}
