module.exports = function (app,mongo,url){

  app.get("/showcourses", function(request, response)  {
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }

      const db = client.db('fitness17');

      const collection = db.collection('courses');


      collection.find({}).toArray(
        function(err, result)
      {
      if (err) throw err;

      //console.log(result[0].hoten);


      response.render("showcourses",{courselist:result,loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email} );
      //console.log(result);


  response.end();

      });

    })
  });

  app.get("/showcoursedetail/:courseid", function(request, response)  {
    var courseid = request.params.courseid;
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

      const courses = db.collection('courses');

      //day la bang join tat ca du lieu cua course and buoitap
      courses.aggregate([
    {

      $lookup:
      {
        from: 'buoitap',
        localField: 'courseid',
        foreignField: 'courseid',
        as: 'buoitap'
      }
    }
  ]).toArray(
    function(err, result)
  {
  if (err) throw err;
  //console.log(result[0].sttbuoi);


  var correctposition = "";
  for(let i=0;i<result.length;i++){
    if(result[i].courseid == courseid ){
      correctposition = i;
    }

  }
  console.log(result);
  console.log(correctposition);
      let buoitap = result[correctposition].buoitap;
      let course =  result[correctposition];

      response.render("showcoursedetail",{course:course,buoitap:buoitap,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );


})
    })


  });

  app.get("/enrollcourse/:courseid", function(request, response)  {
    var courseid = request.params.courseid;

    if(request.session.loggedin !==true)
    {
      let notification = "Vui lòng đăng nhập để đăng kí lớp học !";
      response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
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

            const courses = db.collection('courses');

            //day la bang join tat ca du lieu cua course and buoitap
            courses.aggregate([
          {

            $lookup:
            {
              from: 'buoitap',
              localField: 'courseid',
              foreignField: 'courseid',
              as: 'buoitap'
            }
          }
        ]).toArray(
          function(err, result)
        {
        if (err) throw err;
        //console.log(result[0].sttbuoi);


        var correctposition = "";
        for(let i=0;i<result.length;i++){
          if(result[i].courseid == courseid ){
            correctposition = i;
          }

        }

            let buoitap = result[correctposition].buoitap;
            let course =  result[correctposition];

            response.render("enrollcourse",{course:course,buoitap:buoitap,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );


      })
          })


    }



  });

  app.post("/enrollcoursetodb", function(request, response)  {

    var body = request.body;
    var courseid = request.body.courseid;
    var coursename = request.body.coursename;
    let luachon = body.feechoices;

    var dash = luachon.indexOf('-');
    var feechoices = luachon.slice(0,dash);
    var bill = luachon.slice(dash+1,luachon.length);


    var startday = body.startday;
    let sothang = parseInt(body.sothang);


    var ObjectID=require('mongodb').ObjectID;

    console.log(courseid);


     var temp1 = new Date(startday);

     var endday = new Date(temp1.setMonth(temp1.getMonth()+sothang));

     var temp2 = new Date(startday);

    let ngaydongtien ='';

    if(feechoices =='motthang'){
      feechoices = 1;

      //ngaydongtien =  new Date(temp2.setMonth(temp2.getMonth()+1));

      //Gỉa sử 1 tháng sau là 3 phút sau

      ngaydongtien = new Date;
      console.log('Hiện tại là : ' +ngaydongtien);
      ngaydongtien.setMinutes( ngaydongtien.getMinutes() + 5 );

    }
    else if (feechoices =='cakhoa') {
      feechoices = sothang;
      ngaydongtien = endday;

    }
    console.log('ngay dong tien : ' +ngaydongtien);

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

        const enrollcourse = db.collection('enrollcourse');



        enrollcourse.find({
          "courseid":ObjectID(courseid),
          "useremail":request.session.email


        }).toArray(
          function(err,result){
            if (err) throw err;
            console.log(result);
            console.log(result.length);
            if(result.length == 0){
              enrollcourse.insertOne(
                {
                  courseid:ObjectID(courseid),
                  coursename:coursename,
                  useremail:request.session.email,
                  userfullname:request.session.hoten,
                  sothang:sothang,
                  dongtruoc:feechoices,
                  sothanggiahan:feechoices,
                  bill:bill,
                  ngaydongtienketiep:ngaydongtien,
                  ngayketthuckhoahoc:endday,
                  condition:"pause", //pause là dừng để duyệt , run là đã đc duyệt thanh toán
                  verify:"false" // false la chua thanh toan , true la da duoc thanh toan
                 }

              )
              let notification = "Đăng kí khóa học thành công,vui lòng tới gặp lễ tân để xác nhận thanh toán !";
              response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
            }

            else{
              let notification = "Bạn đã đăng kí khóa học này !";
              response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
            }

          })

      })

    }




  });

  app.get("/signedupcourses", function(request, response)  {
    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }

      //Day la buoc ket bang courses and enrollcourse

      const db = client.db('fitness17');

      const enrollcourse = db.collection('enrollcourse');



      enrollcourse.aggregate([
         { "$match": {  "useremail":request.session.email  } },
        { "$lookup": {
    "from": "courses",
    "localField": "courseid",
    "foreignField": "courseid",
    "as": "courseinfo"
  }},
  { "$unwind": "$courseinfo" }

]).toArray(
function(err, result)
{
if (err) throw err;


response.render("signedupcourses",{courselist:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );

})
    })
  });

  app.get("/coursetimetable/:courseid", function(request, response)  {

    var courseid = request.params.courseid;
    console.log(courseid);
    if(request.session.loggedin===undefined){
      response.send('Vui lòng đăng nhập để đăng kí lớp học !');
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

        const buoitap = db.collection('buoitap');

        buoitap.find({
          $query: {"courseid":ObjectID(courseid)},


        }).sort({"sttbuoi": 1}).toArray(
          function(err,result){
            if (err) throw err;

            response.render("coursetimetable",{buoitap:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );


          }


        )


      })

    }

  });


  app.get('/diemdanh', function(request, response) {

    // Access the provided 'page' and 'limt' query parameters
    let courseid = request.query.courseid;
    let sttbuoi = request.query.sttbuoi;

      var ObjectID=require('mongodb').ObjectID;
    console.log(courseid);
    sttbuoi = parseInt(sttbuoi);
    console.log('sttbuoi:',sttbuoi);

  mongo.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }

    const db = client.db('fitness17');
  const buoitap = db.collection('buoitap');





  buoitap.find({
    "courseid":ObjectID(courseid),
    "sttbuoi":sttbuoi
  }).toArray(
    function(err,result){
      if (err) throw err;

      let training = result[0];


      if(training.dstap.length == 0){
        buoitap.updateOne(
              {courseid:ObjectID(courseid),sttbuoi:sttbuoi},
              {

                $push: {
                  dstap: {"useremail":request.session.email,"fullname":request.session.hoten }
              }

              }

            )

            let notification = "Điểm danh thành công !";
            response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
      }
      else
      {
          console.log('ds tập có ',training.dstap.length);


          function vitritrungemail(){
            for(var i=0;i<training.dstap.length;i++){

              if(request.session.email ===training.dstap[i].useremail)
              {

                return i;

              }


            }
          }


          if(vitritrungemail() < 0 || vitritrungemail() == undefined){

            buoitap.updateOne(
                  {courseid:ObjectID(courseid),sttbuoi:sttbuoi},
                  {

                    $push: {
                      dstap: {"useremail":request.session.email,"fullname":request.session.hoten }
                  }

                  }

                )


                let notification = "Điểm danh thành công !";
                response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
          }
          else{

                  let notification = "Bạn đã điểm danh buổi học này , vui lòng quay lại !";
                  response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
          }


      }



    })


      })

});



app.get('/xoaluotdiemdanh', function(request, response) {

  // Access the provided 'page' and 'limt' query parameters
  let courseid = request.query.courseid;
  let sttbuoi = request.query.sttbuoi;

    var ObjectID=require('mongodb').ObjectID;
  console.log(courseid);
  sttbuoi = parseInt(sttbuoi);
  console.log('sttbuoi:',sttbuoi);

mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }

  const db = client.db('fitness17');
const buoitap = db.collection('buoitap');





buoitap.find({
  "courseid":ObjectID(courseid),
  "sttbuoi":sttbuoi
}).toArray(
  function(err,result){
    if (err) throw err;

    let training = result[0];


    if(training.dstap.length == 0){

          let notification = "Bạn chưa điểm danh buổi này nên không xóa đc !";
          response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
    }
    else
    {

          buoitap.updateOne(
                {courseid:ObjectID(courseid),sttbuoi:sttbuoi},
                {

                  $pull: {
                    dstap: {"useremail":request.session.email,"fullname":request.session.hoten }
                }

                }

              )


              let notification = "Xóa lượt điểm danh thành công !";
              response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});

    }



  })


    })

});


  app.get('/coachinfo/:email', function(request, response){
    var email = request.params.email;


    mongo.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }

      const db = client.db('fitness17');

      const collection = db.collection('staff');

      collection.find({
         "email":email

      }).toArray(
        function(err, result)
      {
      if (err) throw err;

      response.render("coachinfo", {profile: result,loggedin: request.session.loggedin,hoten:request.session.hoten,  vitri:request.session.vitri, email:request.session.email});

  response.end();

      } );


    })




});



app.get("/deletedcourselist", function(request, response)  {
  mongo.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }

    const db = client.db('fitness17');

    const collection = db.collection('deletedcourses');


    collection.find({}).toArray(
      function(err, result)
    {
    if (err) throw err;

    //console.log(result[0].hoten);

      if(request.session.loggedin==true){
    response.render("deletedcourselist",{courselist:result,loggedin: request.session.loggedin,hoten:request.session.hoten,email:request.session.email} );
  }
  else{
     let notification = "Bạn không có quyền truy cập trang này !";
     response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
   }



response.end();

    });

  })
});




}
