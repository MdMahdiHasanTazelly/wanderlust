const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports = index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index", { allListings });
}

module.exports = renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports = showListings = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id)
        .populate('owner')
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });
    //console.log(listing);
    if (!listing) {
        req.flash("error", "Listing doesn't exist.");
        res.redirect("/listings");
    } else {
        let currUser = res.locals.currUser;
        res.render("./listings/show.ejs", { listing, currUser });

    }
}

module.exports = createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    let { path: url, filename } = req.file;

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports = renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("listings/edit", { listing, originalImageUrl });
}

module.exports = updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...listing });
    //if the file exist then it will be updated
    if (typeof req.file != "undefined") {
        let { path: url, filename } = req.file;
        listing.image = { url, filename };
    }

    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports = destroyListing = async (req, res) => {
    let { id } = req.params;
    console.log(await Listing.findByIdAndDelete(id));
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}