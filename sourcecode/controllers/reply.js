module.exports = function (app,mongo,url){
  app.get("/gopy/:courseid", function(request, response)  {

    var courseid = request.params.courseid;
    console.log(courseid);
    if(request.session.loggedin===undefined){
      response.send('Vui lòng đăng nhập để góp ý !');
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

        const enrollcourse = db.collection('enrollcourse');

        enrollcourse.find({
          "courseid":ObjectID(courseid),
          "useremail":request.session.email


        }).toArray(
          function(err,result){
            if (err) throw err;

            response.render("gopy",{course:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );


          }


        )


      })

    }

  });

  app.post("/gopytodb", function(request, response)  {

    var body = request.body;
    var courseid = request.body.courseid;
    var coursename = request.body.coursename;
    var comment = request.body.comment;
    var ObjectID=require('mongodb').ObjectID;

    if(request.session.loggedin===undefined){
      response.send('Vui lòng đăng nhập để đăng kí lớp học !');
    }
    else{

      mongo.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, (err, client) => {
        if (err) {
          console.error(err)
          return
        }

        const db = client.db('fitness17');

        const coursecomment = db.collection('coursecomment');

        coursecomment.insertOne({
          courseid:ObjectID(courseid),
          coursename:coursename,
          userfullname:request.session.hoten,
          useremail:request.session.email,
          comment:comment,
          datecreated:new Date()
        })


      })
      let notification = "Đăng góp ý thành công !";
      response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});


    }




  });



}
