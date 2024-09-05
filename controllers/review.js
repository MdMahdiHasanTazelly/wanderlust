const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports = destroyReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}

module.exports = createReview = async(req, res)=>{

    let id = req.params.id;
    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);   
    newReview.author = req.user._id;

    //console.log(newReview);
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();
    req.flash("success", "New review added!");
    // console.log("Review is saved");
    
    res.redirect(`/listings/${listing._id}`);
}