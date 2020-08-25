var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get("/",function(req,res){
	res.render("landing");
});


////////////////////Auth Routes
router.get("/register",function(req,res){
	res.render("register");
})

router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","welcome to yelpcamp " + user.username);
			res.redirect("/movies");
		})
	})
})

router.get("/login",function(req,res){
	res.render("login");
});

router.post("/login",passport.authenticate("local",{successRedirect:"/movies",failureRedirect: "/login",failureFlash:true}),function(req,res){
	res.send("login post comes here");
});

//////////logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged you out!");
	res.redirect("/movies");
})

module.exports = router;
