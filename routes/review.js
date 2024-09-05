const express = require('express');
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

const middlewares = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//delete review route
router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync( destroyReview ));

//post route
router.post("/", 
    isLoggedIn,
    validateReview, 
    wrapAsync ( createReview ));

module.exports = router;
