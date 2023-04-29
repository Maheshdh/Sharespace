import { ObjectId } from "mongodb"
import {listings} from '../config/mongoCollections.js'
import helpers from '../helpers.js'

export const createListing = async (
    address,
    description,
    price,
    length,
    width,
    height,
    latitude,
    longitute,
    listing_AvailableStartInput,
    listing_AvailableEndInput
) => {

    if (!address || !description || !price || !length || !width || !height|| !pictures|| !latitude|| !longitute|| !availability) throw 'Error: Invalid number of parameters entered (Expected 5)'
    if (!address) throw 'Error: "address" parameter not entered'
    if (!description) throw 'Error: "description" parameter not entered'
    if (!price) throw 'Error: "price" parameter not entered'
    if (!length) throw 'Error: "length" parameter not entered'
    if (!width) throw 'Error: "width" parameter not entered'
    if (!height) throw 'Error: "height" parameter not entered'
    if (!latitude) throw 'Error: "latitude" parameter not entered'
    if (!longitute) throw 'Error: "longitute" parameter not entered'
    if (!listing_AvailableStartInput) throw 'Error: "listing_AvailableStartInput" parameter not entered'
    if (!listing_AvailableEndInput) throw 'Error: "listing_AvailableEndInput" parameter not entered'
   
    let listingsCollection = await listings()
  
    address = helpers.checkString(address, 'address')
    description = helpers.checkString(description, 'description')
    price = helpers.checkPrice(price, 'price')
    length = helpers.checkDimensions(length, 'length')
    width = helpers.checkDimensions(width, 'width')
    height = helpers.checkDimensions(height, 'height')
    listing_AvailableStartInput = helpers.checkDate(listing_AvailableStartInput,"Start Date")
    listing_AvailableEndInput = helpers.checkDate(listing_AvailableEndInput,"End Date")

    let volume = length * width * height;
    
    let listing = {
        address : address,
        description : description,
        price : price,
        length : length,
        width : width,
        height : height,
        volume : volume,
        latitude : latitude,
        longitute : longitute,
        listing_AvailableStartInput : listing_AvailableStartInput,
        listing_AvailableEndInput : listing_AvailableEndInput
    }
    
    let insertedListing = await listingsCollection.insertOne(listing)
    if (!insertedListing.acknowledged || !insertedListing.insertedId) throw 'Error: Could not add listing' 
    let lisitngID =  insertedListing.insertedId.toString();
    return lisitngID;

}

export const deleteListing = async (
    listingID
) => {}

export const modifyListing = async (
    listingID
) => {}

export const getAllListings = async() => {
    const listingsCollection = await listings();
    return await listingsCollection.find({}).toArray();
  };

export const getListing = async(id) => {
    id = helpers.checkId(id,"Listing ID");
    console.log("getListing Data")
    const listingsCollection = await listings();
    const listing = await listingsCollection.findOne({_id: new ObjectId(id)});
    console.log(listing);
    return listing;
};