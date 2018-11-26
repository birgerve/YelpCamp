//all the middleware goes here
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req,res,next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               req.flash("error","Campground not found");
               res.redirect("back");
           } else {
                //does user own the campground? foundcampground.id is een mongoose object, daarom geen tripple =  . req user id is string
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
           }
        });     
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
    //does user own the campground?
};

middlewareObj.checkCommentOwnership = function(req,res,next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if(err) {
               req.flash("error","You don't have permission to do that");
               res.redirect("back");
           } else {
                //does user own the comment? foundComment._id is een mongoose object, daarom geen tripple =  . req user id is string
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
           }
        });     
    } else {
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
};

//middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
       return next(); 
    }  
    req.flash("error","You need to be logged in to do that.");
    res.redirect("/login");
};

module.exports = middlewareObj 