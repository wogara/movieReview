var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware");


router.get("/",function(req,res){
	//get all movies from db
    Movie.find({},function(err,allMovies){
		if(err){
			console.log(err);
		}else{
			//console.log(movies);
			res.render("movies/index",{movies:allMovies,currentUser:req.user});
		}
	})

});



router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to movies array and redirect back to movies page
	var movieName = req.body.name;
	var movieYear = req.body.year;
	var imgUrl = req.body.image;
	var movieReview = req.body.review;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newMovie = {name:movieName,year:movieYear,image:imgUrl,review:movieReview,author:author};
	Movie.create(newMovie,function(err,newlyCreated){
		if (err){
			console.log(err);
		}else{
			res.redirect("/movies");

		}
	})
	//create a new movie and save to database
	
});

router.get('/new',middleware.isLoggedIn,function(req,res){
	res.render("movies/new")
})


router.get("/:id",function(req,res){
	//find movie with provided id
	//show the show template of that movie
	//res.send("this will be the show page");
	Movie.findById(req.params.id).populate("comments").exec(function(err,foundMovie){
		if (err){
			console.log(err);
		}else{
			res.render("movies/show",{movie:foundMovie});
		}
	})
	
})

//edit route
router.get("/:id/edit",middleware.checkMovieOwnership,function(req,res){
	//is user logged in 
	Movie.findById(req.params.id,function(err,found){
		res.render("movies/edit",{movie:found});
	})
})
//update route
router.put("/:id",middleware.checkMovieOwnership,function(req,res){
	Movie.findByIdAndUpdate(req.params.id,req.body.movie,function(err,updated){
		if(err){
			res.redirect("/movies");
		}else{
			res.redirect("/movies/"+req.params.id);
		}

	})
})

//destroy route
router.delete("/:id",middleware.checkMovieOwnership,function(req,res){
	Movie.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/movies");
		}else{
			res.redirect("/movies");

		}
	})
})

module.exports = router;
