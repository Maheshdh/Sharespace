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
        image: imageInput,
        sponsorPay: 0
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
    listingID,
    userID
) => {
    if (!listingID || !userID) throw 'Error: Invalid number of parametes entered (Expected 2)'
    if (!listingID) throw 'Error: Listing ID missing'
    if (!userID) throw 'Error: User ID missing'

    userID = helpers.checkId(userID, 'User ID')
    listingID = helpers.checkId(listingID, 'User ID');
    
    const listingsCollection = await listings();
    let userCollection = await users()

    let listingInfo = await getListing(listingID)
    let userInfo = await userCollection.findOne({_id: new ObjectId(userID)})
    let userInfoListingArray = userInfo.listings

    if (userInfoListingArray.includes(listingID)) {
      let index = userInfoListingArray.indexOf(listingID)
      if (index > -1) {
        userInfoListingArray.splice(index, 1)
      }
    }

    if (userID != listingInfo.userID) throw 'Error: This listing does not belong to you. You cannot delete it'

    const deletionInfo = await listingsCollection.findOneAndDelete({_id: new ObjectId(listingID)});
    if (deletionInfo.lastErrorObject.n === 0) throw `Could not delete listing with id of ${listingID}`;

    let updatingUserInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userID)},
      {$set: {listings: userInfoListingArray}} //Updated listing
      )
    
    return {deleted: true};
}

export const modifyListing = async (
  listingID,
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

    if (!listingID || !title || !address || !description || !price || !length || !width || !height || !latitude|| !longitude|| !listing_AvailableStartInput || !listing_AvailableEndInput) throw 'Error: Invalid number of parameters entered (Expected 10)'
      
    if (!listingID) throw 'Error: "listingID" parameter not entered'
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

    let listingsCollection = await listings()

    let oldListing = await getListing(listingID)

    let newListing = {
      userID: oldListing.userID,
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
      reviews: oldListing.reviews,
      comments: oldListing.comments,
      image: imageInput,
      sponsorPay: oldListing.sponsorPay
    }

    let updatingListing = await listingsCollection.findOneAndUpdate(
      {_id: new ObjectId(listingID)},
      {$set: newListing})
    
    return ({updated: true});
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