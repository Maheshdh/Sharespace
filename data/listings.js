import { ObjectId } from "mongodb"
import { listings } from '../config/mongoCollections.js'
import { users } from "../config/mongoCollections.js"
import helpers from '../helpers.js'

export const createListing = async (
    userID,
    title,
    description,
    address,
    price,
    length,
    width,
    height,
    latitude,
    longitude,
    listing_AvailableStartInput,
    listing_AvailableEndInput,
    imageInput
) => {


    if (!userID || !title || !address || !description || !price || !length || !width || !height || !latitude|| !longitude|| !listing_AvailableStartInput || !listing_AvailableEndInput) throw 'Error: Invalid number of parameters entered (Expected 10)'
    
    if (!userID) throw 'Error: "userID" parameter not entered'
    if (!title) throw 'Error: "title" parameter not entered'
    if (!description) throw 'Error: "description" parameter not entered'
    if (!address) throw 'Error: "address" parameter not entered'
    if (!price) throw 'Error: "price" parameter not entered'
    if (!length) throw 'Error: "length" parameter not entered'
    if (!width) throw 'Error: "width" parameter not entered'
    if (!height) throw 'Error: "height" parameter not entered'
    if (!latitude) throw 'Error: "latitude" parameter not entered'
    if (!longitude) throw 'Error: "longitude" parameter not entered'
    if (!listing_AvailableStartInput) throw 'Error: "listing_AvailableStartInput" parameter not entered'
    if (!listing_AvailableEndInput) throw 'Error: "listing_AvailableEndInput" parameter not entered'
   
    let listingsCollection = await listings()
    let userCollection = await users()
  
    userID = helpers.checkId(userID, 'User ID')
    title = helpers.checkString(title, 'title')
    description = helpers.checkString(description, 'description')
    address = helpers.checkString(address, 'address')
    price = helpers.checkPrice(price.toString(), 'price')
    length = helpers.checkDimension(length.toString(), 'length')
    width = helpers.checkDimension(width.toString(), 'width')
    height = helpers.checkDimension(height.toString(), 'height')
    listing_AvailableStartInput = helpers.checkDate(listing_AvailableStartInput,"Start Date")
    listing_AvailableEndInput = helpers.checkDate(listing_AvailableEndInput,"End Date")

    let volume = length * width * height;
    
    let listing = {
        userID: userID,
        title: title,
        address : address,
        description : description,
        price : price,
        length : length,
        width : width,
        height : height,
        volume : volume,
        latitude : latitude,
        longitude : longitude,
        listing_AvailableStartInput : listing_AvailableStartInput,
        listing_AvailableEndInput : listing_AvailableEndInput,
        reviews: [],
        comments: [],
        image: imageInput
    }
    
    let insertedListing = await listingsCollection.insertOne(listing)
    if (!insertedListing.acknowledged || !insertedListing.insertedId) throw 'Error: Could not add listing' 
    let lisitngID =  insertedListing.insertedId.toString();
    
    let updatingUser = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userID)},
      {$push: {listings: lisitngID}}
    )
    return lisitngID;

}

export const deleteListing = async (
    listingID
) => {
    listingID = helpers.checkId(listingID);
    const listingsCollection = await listings();
    const deletionInfo = await listingsCollection.findOneAndDelete({
      _id: new ObjectId(listingID)
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete listing with id of ${listingID}`];
    return {...deletionInfo.value, deleted: true};
}

export const modifyListing = async (
    listingID,
    address,
    description,
    price,
    length,
    width,
    height,
    latitude,
    longitude,
    listing_AvailableStartInput,
    listing_AvailableEndInput
) => {

    if (!address || !description || !price || !length || !width || !height|| !pictures|| !latitude|| !longitude|| !availability) throw 'Error: Invalid number of parameters entered (Expected 5)'
    if (!address) throw 'Error: "address" parameter not entered'
    if (!description) throw 'Error: "description" parameter not entered'
    if (!price) throw 'Error: "price" parameter not entered'
    if (!length) throw 'Error: "length" parameter not entered'
    if (!width) throw 'Error: "width" parameter not entered'
    if (!height) throw 'Error: "height" parameter not entered'
    if (!latitude) throw 'Error: "latitude" parameter not entered'
    if (!longitude) throw 'Error: "longitude" parameter not entered'
    if (!listing_AvailableStartInput) throw 'Error: "listing_AvailableStartInput" parameter not entered'
    if (!listing_AvailableEndInput) throw 'Error: "listing_AvailableEndInput" parameter not entered'
   
    listingID = helpers.checkId(listingID, 'listingID') 
    address = helpers.checkString(address, 'address')
    description = helpers.checkString(description, 'description')
    price = helpers.checkPrice(price, 'price')
    length = helpers.checkDimensions(length, 'length')
    width = helpers.checkDimensions(width, 'width')
    height = helpers.checkDimensions(height, 'height')
    listing_AvailableStartInput = helpers.checkDate(listing_AvailableStartInput,"Start Date")
    listing_AvailableEndInput = helpers.checkDate(listing_AvailableEndInput,"End Date")

    let updatedListing = {
        address : address,
        description : description,
        price : price,
        length : length,
        width : width,
        height : height,
        volume : volume,
        latitude : latitude,
        longitude : longitude,
        listing_AvailableStartInput : listing_AvailableStartInput,
        listing_AvailableEndInput : listing_AvailableEndInput
  
      };
      let listingsCollection = await listings()
      const updateInfo = await listingsCollection.findOneAndReplace(
        {_id: new ObjectId(listingID)},
        updatedListing,
        {returnDocument: 'after'}
      );
      if (updateInfo.lastErrorObject.n === 0)
        throw [404, `Error: Update failed! Could not update listing with id ${listingID}`];
      return updateInfo.value;

}

export const getAllListings = async() => {
    const listingsCollection = await listings();
    return await listingsCollection.find({}).toArray();
  };

export const getListing = async(id) => {
    id = helpers.checkId(id,"Listing ID");
    const listingsCollection = await listings();
    const listing = await listingsCollection.findOne({_id: new ObjectId(id)});
    return listing;
};


export const countListings = async() => {
    let listingsCollection = await listings()
    return listingsCollection.countDocuments()
}