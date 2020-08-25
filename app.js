var express            = require('express'),
	app            = express(),
	bodyParser     = require('body-parser'),
	mongoose       = require('mongoose'),
	passport       = require("passport"),
	Movie          = require('./models/movie'),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	LocalStrategy  = require("passport-local");
	methodOverride = require("method-override");
	flash          = require('connect-flash');

var commentRoutes      = require("./routes/comments"),
	movieRoutes    = require("./routes/movies");
	indexRoutes    = require("./routes/index");


var url = process.env.DATABASEURL;

mongoose.connect(url,{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("connected to db");
}).catch(err =>{
	console.log("ERROR: ",err.message);
});

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+ "/public"));
app.use(flash());

app.use(require("express-session")({
	secret: "bruno is a very good boy named ezekiel",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoutes);
app.use("/movies",movieRoutes);
app.use("/movies/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,function(){
	console.log("app listening on port ");
});
