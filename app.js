var express                = require('express'),
    app                    = express(),
    router                 =express.Router({mergeParams:true}),
    mongoose               = require('mongoose'),
    bodyParser             = require('body-parser'),
    methodOverride         = require("method-override"),
    passport               = require('passport'),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    flash                  = require("connect-flash"),
    User                   = require("./models/user"),
    middleware             = require("./middleware/index")
    
    
mongoose.connect("mongodb://localhost/dbms_project");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());



//Passport Initialization
app.use(require("express-session")({
    secret: "Hahahahaha",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});



//Routes    


app.get('/register', function(req,res){
    res.render("register");
})

app.post("/register", function(req,res){
    var newUser= new User({username: req.body.username, name: req.body.name, balance:req.body.balance});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err.message);
            return res.render("register");
        } 
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " +user.username);
            res.redirect("/home");
            });
    });
});

app.get('/', function(req,res){
    res.render("landing");
})

//Login Check Route
app.post("/", passport.authenticate("local",{
    successRedirect     :"/home",
    failureRedirect     :"/"
}), function(req,res){
});

//Logout Route
app.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Successfully Logged you Out")
    res.redirect("/");
});

app.get('/home',middleware.isLoggedIn ,function(req,res){
    User.findById(req.user._id, function(err, user){
        if(err){
            console.log(err);
        } else {
             res.render("home",{user: user});
        }
    })
})

app.put("/home/withdraw",middleware.isLoggedIn, function(req,res){
    var amountDedud = req.body.balance; 
    User.update({"_id":req.user._id}, {$inc: {"balance":-amountDedud}} , function(err){
        if(err){
            res.redirect("/home");
            console.log(err)
        }else{
            User.findByIdAndUpdate(req.user._id,req.body.balance ,function(err, updateduser){
                if(err){
                    console.log(err);
                } else {
                     req.flash("success", "Balance Updated");
                     console.log("After Updare "+updateduser)
                     res.render("home",{user:updateduser});
                }
        })
    }
});
});

app.put("/home/deposit",middleware.isLoggedIn, function(req,res){
    var amountAdd = req.body.deposit; 
    User.update({"_id":req.user._id}, {$inc: {"balance":+amountAdd}} , function(err){
        if(err){
            res.redirect("/home");
            console.log(err)
        }else{
            User.findByIdAndUpdate(req.user._id,req.body.balance ,function(err, updateduser){
                if(err){
                    console.log(err);
                } else {
                     req.flash("success", "Balance Updated");
                     console.log("After Updare "+updateduser)
                     res.render("home",{user:updateduser});
                }
        })
    }
});
});


    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The DBMS  Server Has Started!");
});
