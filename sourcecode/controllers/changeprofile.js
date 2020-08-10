module.exports = function (app,mongo,url){
  app.get('/changeprofile/:email', function(request, response){
      var email = request.params.email;
      console.log(email);


      mongo.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
          console.error(err)
          return
        }

        const db = client.db('fitness17');

        const collection = db.collection('users');

        collection.find({
           "email":email

        }).toArray(
          function(err, result)
        {
        if (err) throw err;

        response.render("changeprofile", {profile: result,loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email});





    response.end();

        } );


      })




  });


  app.post("/updateprofile", function(request, response)  {
    var hoten = request.body.hoten;
    var dob = request.body.dob;
    var tel = request.body.tel;
    var email = request.body.email;
    var cmnd = request.body.cmnd;



    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      const db = client.db('fitness17');

      const collection = db.collection('users');


      //time1 : 9:00 -10:00,time2: 10:00-11:00

      collection.updateOne(
        {email:email},
        {
          $set:{
            hoten:hoten,
            namsinh:dob,
            tel:tel,
            cmnd:cmnd
          }
        }

      )





    })

    response.send("Update thành công !");


  })

}
