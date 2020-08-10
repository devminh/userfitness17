

module.exports = function (app,mongo,url){
  app.post('/signup', function (req, res, next) {
    var body = req.body;

    let fullname = body.fullname;
    let email = body.email;
    let tel = body.tel;
    let password1 = body.password1;
    let password2 = body.password2;
    let cmnd = body.cmnd;
    let dob =  body.dob;
    let weight = body.weight;
    let height = body.height;
    let vong1= body.vong1;
    let vong2= body.vong2;
    let vong3=body.vong3;
    let luongco = body.muscle;
    let luongmo = body.fatmass;

    //res.set('Content-Type', 'text/html');
    /*
    if(password1 !== password2){
      console.log("sai pass !");

    }
    else{
      res.render("signupstaff");
    }
*/


    console.log(fullname);

    console.log('length cmnd :'+cmnd.length);

    const bcrypt = require('bcrypt');





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
         "email": email

      }).toArray(
        function(err, result)
      {
      if (err) throw err;

      if(password1 == password2){
          let hash = bcrypt.hashSync(password1, 10);
        if(result.length > 0){
          let notification = "Email đã tồn tại !";
          res.render("thongbao",{notification:notification,loggedin: req.session.loggedin,hoten:req.session.hoten, email:req.session.email});
        }
        else{
          if(cmnd.length !== 9 && cmnd.length !== 12){
            let notification = "CMND phải có 9 hoặc 12 kí số !";
            res.render("thongbao",{notification:notification,loggedin: req.session.loggedin,hoten:req.session.hoten, email:req.session.email});
          }
          else{
            collection.insertOne(
             {
               hoten: fullname,
               namsinh:dob,
               email : email,
               tel : tel,
               cmnd:cmnd,
               password : hash,
               chieucao:height,
               cannang:weight,
               vong1:vong1,
               vong2:vong2,
               vong3:vong3,
               luongco:luongco,
               luongmo:luongmo
             }
           );
           req.session.loggedin = true;
           req.session.email = email;
           req.session.hoten = fullname;
             res.redirect('/');
          }

        }

      }
      else{
        let notification = "Mật khẩu nhập lại không trùng !";
        res.render("thongbao",{notification:notification,loggedin: req.session.loggedin,hoten:req.session.hoten,  vitri:req.session.vitri, email:req.session.email});


      }








      });

    })


  });

}
