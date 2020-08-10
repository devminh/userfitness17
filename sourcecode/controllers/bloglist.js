module.exports = function (app,mongo,url){
  app.get("/bloglist", function(request, response)  {

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

          collection.find({}).sort( { date: -1 } ).toArray(
            function(err, result)
          {
          if (err) throw err;
          response.render('bloglist', {result: result,loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email});



        })

        })



  });
}
