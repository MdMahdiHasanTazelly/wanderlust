const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const middlewares = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// *********for testing purpose************
router.get("/test", (req, res)=>{
    console.log(validateListing);    
    console.log(listingController);
});

router.
route("/")
// index route
.get( wrapAsync( index ))
//create route
.post( upload.single('listing[image]'), validateListing, wrapAsync( createListing ))



//new route
router.get("/new", isLoggedIn, saveRedirectUrl, wrapAsync( renderNewForm ));


router
.route("/:id")
//delete route
.delete( isLoggedIn, wrapAsync( destroyListing ))
//update route
.put( upload.single('listing[image]'), validateListing, wrapAsync( updateListing ))
// show route
.get( wrapAsync( showListings ));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync( renderEditForm ));


module.exports = router;