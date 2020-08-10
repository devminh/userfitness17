module.exports = function (app,mongo,url){
  app.get('/showblog/:id', function(request, response){
      var postid = request.params.id;
      console.log(postid);

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

        const collection = db.collection('blogs');

        collection.find({
           _id : ObjectID(postid)

        }).toArray(
          function(err, result)
        {
        if (err) throw err;
        console.log(result);
        response.render("showblog", {result: result,loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email});





    response.end();

        } );


      })




  });

}
