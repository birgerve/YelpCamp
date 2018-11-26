var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    Campground          = require("./models/campground"),
    seedDB              = require("./seeds"),
    Comment             = require("./models/comment"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash");
  
//requiring routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")

//export DATABASEURL=mongodb://localhost:27017/yelp_camp
var url = process.env.DATABASEURL;
console.log(url);
mongoose.connect(url);
//mongoose.set("useFindAndModify", false);
//mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
//mongoose.connect('mongodb://birger:birger1@ds117334.mlab.com:17334/yelpcamp-birgerve', {useNewUrlParser: true});
//mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seed the DB
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Arco is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,function() {
    console.log("YelpCampServer has started");
});