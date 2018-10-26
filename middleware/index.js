var User = require("../models/user")

var middlewareObj ={};


middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged in to do that");
    res.redirect("/");
}


module.exports= middlewareObj