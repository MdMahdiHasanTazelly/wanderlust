const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then( ()=> console.log(`Database connection established`))
.catch( (err)=> console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function initDB(){
    await Listing.deleteMany({});  //cleaning the database
    initData.data = initData.data.map( (obj)=>({...obj, owner: "66c1d57cc8cc89c8eb624b36"}));
    Listing.insertMany(initData.data)
    .then( ()=> console.log(`Data inserted into DB`));

    //console.log('Database is initialized');
}

initDB();