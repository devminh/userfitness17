
module.exports = function (app,mongo,url){
  app.post('/auth', function(request, response) {
  	var email = request.body.email;
  	var password = request.body.password;


  	if (email && password) {

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
        const bcrypt = require('bcrypt');


        collection.find({
           "email": email,


        }).toArray(
          function(err, result)
        {
        if (err) throw err;

        if(result == 0){
          let notification = "Tài khoản không tồn tại !";
          response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
        }
        else{
          if(bcrypt.compareSync(password, result[0].password))
          {
            // Passwords match

     request.session.loggedin = true;
     request.session.email = email;
     request.session.hoten = result[0].hoten;
     request.session.vitri = result[0].vitri;



     response.redirect('/');

      }
      else{
        let notification = "Bạn nhập sai mật khẩu !";
        response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
      }


      }


        });


      })

  }
  else {
    response.send('Please enter Username and Password!');

  }


  });

  app.get("/signin", function(request, response)  {
      response.render("signin",{loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email} );
  });



}
