
module.exports = function (app,mongo,url){

app.get("/giahankhoahoc/:courseid", function(request, response)  {
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

    //Day la buoc ket bang courses and enrollcourse

    const db = client.db('fitness17');

    const enrollcourse = db.collection('enrollcourse');



    enrollcourse.aggregate([
       { "$match": {  "courseid":ObjectID(courseid),"useremail":request.session.email  } },
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

  console.log(result);

response.render("giahankhoahoc",{course:result,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email} );

})
  })
});

  app.post("/giahantodb", function(request, response)  {
    var body = request.body;

    var month_selection = body.sothanggiahan;

    var dash = month_selection.indexOf('-');
    var sothanggiahan = month_selection.slice(0,dash);

    var bill = month_selection.slice(dash+1,month_selection.length);

    sothanggiahan = parseInt(sothanggiahan);

    var courseid = request.body.courseid;



    var ObjectID=require('mongodb').ObjectID;

    var dongtruoc = parseInt(body.dongtruoc);


    var nextdaypayment = body.nextdaypayment;

    var updatedmonth = dongtruoc + sothanggiahan;

    console.log('dong truoc :',updatedmonth);

    nextdaypayment = new Date(nextdaypayment);

    nextdaypayment.setMonth(nextdaypayment.getMonth()+sothanggiahan);
    console.log(nextdaypayment);

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



          enrollcourse.updateOne(
                {courseid:ObjectID(courseid),useremail:request.session.email},
                {

                  $set:
                {

                  dongtruoc:updatedmonth,
                  sothanggiahan:sothanggiahan,
                  bill:bill,
                  ngaydongtienketiep:nextdaypayment,
                  verify:"false"
                }

                }

              )

              let notification = "Gia hạn khóa học thành công,vui lòng tới gặp lễ tân để xác nhận thanh toán !";
              response.render("thongbao",{notification:notification,loggedin: request.session.loggedin,hoten:request.session.hoten, email:request.session.email});
        })


  })


}
