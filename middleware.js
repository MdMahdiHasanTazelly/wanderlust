const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports = isReviewAuthor = async(req, res, next)=>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if( !review.author.equals(res.locals.currUser._id) ){
        req.flash("error", "You ain't author of this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
}


module.exports = validateReview = (req, res, next)=>{
    
    let { error } = reviewSchema.validate(req.body);

    if( error ){
        let errMsg = error.details.map( (el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{

        next();
    }
}

module.exports = validateListing = (req, res, next)=>{
    let { error } = listingSchema.validate(req.body);
    if( error ) {
        let errMsg = error.details.map( (el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports = saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        return next();
    }
    next();
}

module.exports = isLoggedIn = (req, res, next)=>{
    if( !req.isAuthenticated() ){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must log in");
        return res.redirect("/login");
    }
    next();
}

