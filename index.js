// ------------------------------------------------ Dependencies used ------------------------------------------------
var express = require("express");
var fileuploader = require("express-fileupload");
var nodemailer = require("nodemailer");
var mysql = require("mysql2");
var app = express();


// ------------------------------------------------ Port configuration ------------------------------------------------
var PORT = 2000;
app.listen(PORT, function () {
  console.log(`Server started at port:- ${PORT}`);
});


// ------------------------------------------------ Dependencies configuration ------------------------------------------------
app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded(true));

var dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "Kumar@29",
  database: "cyberbazaardatabase",
};

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (err) {
  if (err == null) {
    console.log(`Successfully connected to:- ${dbConfig.database}`);
  } else {
    console.log(err);
  }
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arora.saksham.k@gmail.com",
    pass: "zvhwbcctnsnmayxu",
  }
});


// ------------------------------------------------ Index page API's started ------------------------------------------------

// ------------------------------------------------ Signup email check function ------------------------------------------------
app.get("/signup-chk-email", function (req, resp) {
  var email = req.query.emailentered;
  dbCon.query("select * from users where email = ?", [email], function (err, result) {
      if (err == null) {
        if (result.length == 1) {
          resp.send(" Email already exists, please login...");
        } else {
          resp.send(" Available...");
        }
      } else {
        resp.send(err);
      }
    });
});


// ------------------------------------------------ Do signup function ------------------------------------------------
app.get("/dosignup", function (req, resp) {
  var email = req.query.emailentered;
  var pwd = req.query.pwdentered;

  var mailOptions = {
    from: "arora.saksham.k@gmail.com",
    to: email,
    subject: "Account has been created on Cyberbazaar.com",
    text: `Welcome ${email}, you have been successfully registed on our website. If not please just ignore this mail. With regards from Cyberbazaar`
  };

  dbCon.query("insert into users values(?,?,1)", [email, pwd], function (err) {
      if (err == null) {

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email successfully sent to ${email}`);
          }
        });

        resp.send("Record saved successfully");
      } else {
        resp.send(err);
      }
    });
});


// ------------------------------------------------ Do login function ------------------------------------------------
app.get("/dologin", function (req, resp) {
  var email = req.query.emailentered;
  var pwd = req.query.pwdentered;

  var mailOptions = {
    from: "arora.saksham.k@gmail.com",
    to: email,
    subject: "Account login on Cyberbazaar.com",
    text: `Your email:- ${email} has been used to login on our website. If not please please check your account activity and if possible change your account password to something secure. With regards from Cyberbazaar`
  };

  dbCon.query("select * from users where email = ?", [email], function (err, result) {
      if (err == null) {
        if (result.length == 1) {
          if (result[0].pwd == pwd) {
            if (result[0].status == 1) {

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log(`Email successfully sent to ${email}`);
                }
              });

              resp.send("Logined successfully");
            } else {
              resp.send(" The user has been blocked...");
            }
          } else {
            resp.send(" Invalid password...");
          }
        } else {
          resp.send(" No user found...");
        }
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Index page API's ended ------------------------------------------------


// ------------------------------------------------ Sellers profile page API's started ------------------------------------------------
// ------------------------------------------------ Seller profile search function ------------------------------------------------
app.get("/profile-search", function (req, resp) {
  var email = req.query.emailentered;
  dbCon.query("select * from sellers where email = ?", [email], function (err, result) {
      if (err == null) {
        resp.send(result);
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do seller profile submit function ------------------------------------------------
app.post("/profile-submit", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.txtcity;
  var idpicname = "nopic.jpg";

  if (req.files != null) {
    idpicname = req.files.txtimage.name;
    var path = process.cwd() + "/public/uploads/" + idpicname;
    req.files.txtimage.mv(path);
  }

  dbCon.query("insert into sellers values(?,?,?,?,?,?)", [email, name, contact, address, city, idpicname], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Do seller profile update function ------------------------------------------------
app.post("/profile-update", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.txtcity;
  var idpicname = "nopic.jpg";

  if (req.files != null) {
    idpicname = req.files.txtimage.name;
    var path = process.cwd() + "/public/uploads/" + idpicname;
    req.files.txtimage.mv(path);
  } else {
    idpicname = req.body.hdnpicname;
  }

  dbCon.query("update sellers set name = ?, contact = ?, address = ?, city = ?, idpicname = ?, where email = ?", [name, contact, address, city, idpicname, email], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Seller profile page API's ended ------------------------------------------------


// ------------------------------------------------ Add products page API's started ------------------------------------------------
// ------------------------------------------------ Do seller profile submit function ------------------------------------------------
app.post("/product-details-submit", function (req, resp) {
  var email = req.body.txtemail;
  var name = req.body.txtname;
  var contact = req.body.txtcontact;
  var address = req.body.txtaddress;
  var city = req.body.txtcity;
  var keyword = req.body.txtkeyword;
  var brand = req.body.txtbrand;
  var price = req.body.txtprice;
  var modelname = req.body.txtmodelname;
  var description = req.body.txtdescription;
  var productpicname = "nopic.jpg";

  if (req.files != null) {
    productpicname = req.files.txtimage.name;
    var path = process.cwd() + "/public/uploads/" + productpicname;
    req.files.txtimage.mv(path);
  }

  dbCon.query("insert into products values(0,?,?,?,?,?,?,?,?,?,?,?)", [email, name, contact, address, city, keyword, brand, price, modelname, description, productpicname], function (err) {
      if (err == null) {
        resp.sendFile(process.cwd()+"/public/record-saved.html");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Add products page API's ended ------------------------------------------------


// ------------------------------------------------ Product manager page API's started ------------------------------------------------
// ------------------------------------------------ Fetching products function ------------------------------------------------
app.get("/fetch-products", function (req, resp) {
  var email = req.query.email;
  dbCon.query("select * from products where email = ?", [email], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Unlisting Products function ------------------------------------------------
app.get("/unlist-products", function (req, resp) {
  var id = req.query.id;
  dbCon.query("delete from products where id = ?", [id], function (err, result) {
      if (err == null) {
        resp.send("Product unlisted successfully");
      } else {
        resp.send(err);
      }
    });
});

// ------------------------------------------------ Product manager page API's ended ------------------------------------------------


// ------------------------------------------------ Product gallery page API's started ------------------------------------------------
// ------------------------------------------------ Fetching products from keyword function ------------------------------------------------
app.get("/fetch-products-from-keyword", function (req, resp) {
  var keyword = req.query.keyword;
  dbCon.query("select * from products where keyword = ?", [keyword], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Product gallery page API's ended ------------------------------------------------


// ------------------------------------------------ Product page API's started ------------------------------------------------
// ------------------------------------------------ Fetching product details function ------------------------------------------------
app.get("/fetch-product-details", function (req, resp) {
  var productID = req.query.productID;
  dbCon.query("select * from products where id = ?", [productID], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Adding product to cart function ------------------------------------------------
app.get("/add-to-cart", function (req, resp) {
  var productData = JSON.parse(req.query.productData);
  var useremail = req.query.useremail;
  var id = productData[0].id;
  var productpicname = productData[0].productpicname;
  var modelname = productData[0].modelname;
  var brand = productData[0].brand;
  var price = productData[0].price;

  dbCon.query("insert into cart values(?,?,?,?,?,?)", [useremail,id,productpicname,modelname,brand,price], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Product page API's ended ------------------------------------------------


// ------------------------------------------------ Cart page API's started ------------------------------------------------
// ------------------------------------------------ Fetching products in cart function ------------------------------------------------
app.get("/fetch-cart", function (req, resp) {
  var useremail = req.query.useremail;
  dbCon.query("select * from cart where useremail = ?", [useremail], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Removing products from cart function ------------------------------------------------
app.get("/remove-product", function (req, resp) {
  var id = req.query.id;
  dbCon.query("delete from cart where id = ?", [id], function (err, result) {
    if (err == null) {
      resp.send(result);
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Buying products from cart function ------------------------------------------------
app.get("/buy-product", function (req, resp) {
  var id = req.query.id;
  var email = req.query.email;

  var mailOptions = {
    from: "arora.saksham.k@gmail.com",
    to: email,
    subject: "Order placed on Cyberbazaar.com",
    text: `Your order has been placed and will reach at your provided address by 4-5 working days. With regards from Cyberbazaar`
  };

  dbCon.query("delete from cart where id = ?", [id], function (err, result) {
    if (err == null) {

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email successfully sent to ${email}`);
        }
      });

      resp.send("Your order has been placed successfully");
    } else {
      resp.send(err);
    }
  });
});

// ------------------------------------------------ Cart page API's ended ------------------------------------------------