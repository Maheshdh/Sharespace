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
    pictures,
    latitude,
    longitute,
    availability
) => {

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