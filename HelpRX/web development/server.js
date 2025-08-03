var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");

var app = express();

app.listen(2004, function () {
  console.log("Server Started...");
})


app.use(express.urlencoded({ extended: true })); // ✅ correct syntax
//binary to object(body) conversion
app.use(express.json());
app.use(fileuploader());
app.use(express.static("public"));

//URL Handler
app.get("/fun", function (req, resp) {
  //var dir=__dirname;
  var dir = process.cwd();

  var file = __filename;
  console.log(dir + " ,  " + file);
  resp.send(dir + "   ,  " + file);
  /*resp.contentType("text/html");
  resp.write("<center><h3>Signup Here</h3></center>");
  resp.write("<br>Welcome");
  resp.end();
  //resp.send("Signup Here");
  */
})
app.get("/signup", function (req, resp) {
  //  console.log("signuppppp...");
  resp.sendFile(process.cwd() + "/public/signup.html");
})
//========================
app.get("/login", function (req, resp) {
  console.log("loginnnnnn .. .. ");
  resp.contentType("text/html");
  resp.write("<center><h3>Login Here</h3></center>");
  resp.write("<br>Welcome");
  resp.end();
  //resp.send("Signup Here");
})

app.get("/signup-process", function (req, resp) {
  //resp.send("Data Reached");
  var quali = "";

  if (req.query.qualib != undefined)//checked
    quali = req.query.qualib + ",";

  if (req.query.qualim != undefined)
    quali = quali + req.query.qualim;

  if (req.query.qualib == undefined && req.query.qualim == undefined)
    quali = "No Qualification";

  if (quali.endsWith(","))
    quali = quali.substring(0, quali.length - 1);

  var city = req.query.comboCity;
  resp.send("Welcome=" + req.query.txtEmail + " ,,,,,,  " + req.query.txtPwd + "  Qualification=" + quali + " , Occupation=" + req.query.occu + " City=" + city);
})

app.get("/signup-secure", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/signup-secure.html");
})
app.get("/", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/index.html");
})
app.get("/angular", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/angular.html");
})

app.get("/db-signup", function (req, resp) {
  resp.sendFile(process.cwd() + "/public/DB-signup.html");
})

app.post("/chk-signup", function (req, resp) {

  var email = req.body.kuchEmail;
  var pwd = req.body.kuchPwd;
  var option = req.body.kuchOp;
  console.log(option);

  dbCon.query("insert into users (email,pwd,utype,dos,status) VALUES (?,?,?,CURRENT_TIMESTAMP,1)", [email, pwd, option], function (err, resultTable) {
    if (err == null) {
      console.log("Insert Success:", resultTable);
      resp.send("Record Saved...");
    } else {
      console.log("Insert Error:", err);
      resp.send(err);
    }


  })


})

app.post("/signup-process-secure", function (req, resp) {
  resp.send("Data Reached");
  var quali = "";

  if (req.body.qualib != undefined)//checked
    quali = req.body.qualib + ",";

  if (req.body.qualim != undefined)
    quali = quali + req.body.qualim;

  if (req.body.qualib == undefined && req.body.qualim == undefined)
    quali = "No Qualification";

  if (quali.endsWith(","))
    quali = quali.substring(0, quali.length - 1);

  //---------------File Uploading================
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.ppic.mv(path);
  }

  var city = req.body.comboCity;
  var cities = req.body.listCity.toString();
  resp.send("Welcome=" + req.body.txtEmail + " <br>  " + req.body.txtPwd + "<br> Qualification=" + quali + "<br> Pic Name=" + fileName + "<br>  City=" + city + "<br>  Cities=" + cities);
  console.log(req.body);

})
app.get("/chk-old-pwd", function(req,resp){

  var email = req.query.email;
  var pwd = req.query.oldpwd;

  dbCon.query("select * from users where email = ?",[email],function(err,result){

    if (err == null)
    {
      if (pwd == result.pwd){
        console.log("entered pwd matches the oldm");
      }
      console.log(result);
      console.log("Done !!!");
      resp.send("qsdcdsdz !!!");
    }
    else {
      console.log("Errrrr :");
      console.log(err);
    }

  })

})
//-=-------------------------DB Operations-------------------
//================Database Connectivity============
/*var dbConfig={

  host:"127.0.0.1",
  user:"root",
  password:"bce",
  database:"2023-jan",
  dateStrings:true
}*/


// ================below code was working===================
var dbConfig = {
  host: "bdky7jufzyf77kd4slz6-mysql.services.clever-cloud.com",
  user: "ufwsefowzdk5a2ga",
  password: "b17FxqzJtNCZBMZeZzBU",
  database: "bdky7jufzyf77kd4slz6"
};

// var dbConfig = {
//   host : "127.0.0.1",
//   user : "root",
//   password : "J@sdeepgill",
//   database : "newdatabase"

// }

var dbCon = mysql.createConnection(dbConfig);//dbCon is an object
dbCon.connect(function (jasoos) {
  if (jasoos == null)
    console.log("Connected Successfulllyyy...");
  else {
    console.log("Err . . . ");
    console.log(jasoos);
  }
})

// ----------- Needy profile -----------------
app.post("/db2-signup-secure-process", function (req, resp) {
  let picname = "default.jpg";
  const { txtEmail, txtName, txtContact, txtAddress, txtCity, txtidproof, am, pm } = req.body;
  // var email = req.body.txtEmail;
  // console.log(email);
  console.log("/db2-signup-secure-process link executed !!!");

  const params = [
    txtEmail,
    txtName,
    txtContact,
    txtAddress,
    txtCity,
    txtidproof,
    picname,
    am,
    pm
  ];

  if (req.files && req.files.ppic) {
    const picFile = req.files.ppic;
    picname = Date.now() + "-" + picFile.name;

    const uploadPath = __dirname + "/public/uploads/" + picname;

    picFile.mv(uploadPath, err => {
      if (err) {
        console.error("File Upload Failed:", err);
        return resp.status(500).send("File upload error");
      }
    });
  }

  dbCon.query(
    "INSERT INTO profile(email, name, contact, address, city, idproof, idpic, am, pm, dos, utype)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'Donar')",
    params,
    (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
        return resp.status(500).send("Database error");
      }
      req.session.successMsg = "Sign-in successful. Welcome!";
      // resp.send("Sign-in successful. Welcome!");
    }
  );
})
app.get("/avail-med", function (req, resp) {

  console.log("/avail-medicine");
// console.log(req.query);
  var email = req.query.email;
  var mdname = req.query.mdname;
  var expdate = req.query.expdate;
  var packing = req.query.packing;
  var qty = req.query.qty;

  const today = new Date();
  expdate = new Date(expdate);

  today.setHours(0, 0, 0, 0);
  expdate.setHours(0, 0, 0, 0); 

  console.log("expiry date",expdate);

  console.log(today);
  const twoMonths = new Date(today);
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  const diff_five_yrs = new Date(today);
  diff_five_yrs.setFullYear(diff_five_yrs.getFullYear() + 5);

  if (expdate <= twoMonths )
  {
    console.log("Too soon: less than 2 months");
  }
  else if ( expdate >= diff_five_yrs){
    console.log("Invalid");
  }
  else{
    console.log("Medicine good to go");
  }

  dbCon.query("insert into medsavailable1(email,med,expdate,packing,qty) values (?,?,?,?,?)",[email,mdname,expdate,packing,qty], function(err){

    if (err == null){

      console.log("done !!!");
      // resp.send("You posted meds");
      
    }
    else {
      console.log("err");
      console.log(err);
      // resp.send(err);
    }
  })


})


app.post("/db-signup-process-secure", function (req, resp) {
  //---------------File Uploading================
  var fileName = "nopic.jpg";
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.ppic.mv(path);
  }
  console.log(req.body);
  //resp.send("   File name="+fileName);

  //saving data in table
  var email = req.body.txtEmail;
  var password = req.body.txtPwd;
  var dob = req.body.dob;

  //fixed       //same seq. as in table
  dbCon.query("insert into users2023(email,password,picname,dob) values(?,?,?,?)", [email, password, fileName, dob], function (err) {
    if (err == null)
      resp.send("Record Saved Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
    else
      resp.send(err);
  })
})
//--------------------------------
app.post("/db-delete-process-secure", function (req, resp) {
  //saving data in table
  var email = req.body.txtEmail;


  //fixed                             //same seq. as in table
  dbCon.query("delete from users2023 where email=?", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
      else
        resp.send("Invalid Email id");
    }
    else
      resp.send(err);
  })
})


//--------------------------------
app.get("/chk-email", function (req, resp) {
  //saving data in table


  //fixed                             //same seq. as in table
  dbCon.query("select * from users2023 where email=?", [req.query.kuchEmail], function (err, resultTable) {
    if (err == null) {
      if (resultTable.length == 1)
        resp.send("Already Taken...");
      else
        resp.send("Available....!!!!");
    }
    else
      resp.send(err);
  })
})

// ------------- Login to account -----------
app.post("/loginuser", function (req, resp) {

  var loginEmail = req.body.kuchEmailL;

  console.log("/loginuser command is being executed");
  console.log(loginEmail);
  dbCon.query("select * from users where email=?", [loginEmail], function (err, resultTableJSON) {

    if (err == null) {
      console.log(resultTableJSON[0].utype);
      resp.send(resultTableJSON[0].utype);
    }
    else {
      console.log(err);
      resp.send(err);
    }


  })
})

//--------------------------------
app.get("/get-json-record", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from users2023 where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})
//====================================
app.post("/db-update-process-secure", function (req, resp) {
  //---------------File Uploading================
  var fileName;
  if (req.files != null) {
    //console.log(process.cwd());
    fileName = req.files.ppic.name;
    var path = process.cwd() + "/public/uploads/" + fileName;
    req.files.ppic.mv(path);
  }
  else {
    fileName = req.body.hdn;
  }
  console.log(req.body);
  //resp.send("File name="+fileName);

  //saving data in table
  var email = req.body.txtEmail;
  var password = req.body.txtPwd;
  var dob = req.body.dob;

  //fixed                             //same seq. as in table
  dbCon.query("update users2023 set password=?,picname=?,dob=? where email=?", [password, fileName, dob, email], function (err) {
    if (err == null)
      resp.send("Record Updated Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
    else
      resp.send(err);
  })
})

//--------------------------------
app.get("/get-angular-all-records", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select * from users2023", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})


app.get("/do-angular-delete", function (req, resp) {
  //saving data in table
  var email = req.query.emailkuch;


  //fixed                             //same seq. as in table
  dbCon.query("delete from users2023 where email=?", [email], function (err, result) {
    if (err == null) {
      if (result.affectedRows == 1)
        resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
      else
        resp.send("Inavlid Email id");
    }
    else
      resp.send(err);
  })
})


app.get("/get-citiess", function (req, resp) {
  //fixed                             //same seq. as in table
  dbCon.query("select distinct city from medTableName", function (err, resultTableJSON) {
    if (err == null)
      resp.send(resultTableJSON);
    else
      resp.send(err);
  })
})


