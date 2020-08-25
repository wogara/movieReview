var middlewareObj = {};
var Movie = require("../models/movie");
var Comment = require("../models/comment");

middlewareObj.checkMovieOwnership = function(req,res,next){
	if (req.isAuthenticated()){
		//whatever
		Movie.findById(req.params.id,function(err,found){
			if(err){
				req.flash("error","movie not found");
				res.redirect("back");
			}else{
				if (!found) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				//does user own movie
				if(found.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","you can only edit a movie you posted");
					res.redirect("back");
				}
				
			}
		})
	}else{
		req.flash("error","please login first");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if (req.isAuthenticated()){
		//whatever
		Comment.findById(req.params.comment_id,function(err,found){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				 if (!found) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				//does user own movie
				if(found.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","you can only edit a comment you posted");
					res.redirect("back");
				}
				
			}
		})
	}else{
		req.flash("error","please login first");
		res.redirect("back");
	}
}


middlewareObj.isLoggedIn = function(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first")
	res.redirect("/login");
}

module.exports = middlewareObj;
