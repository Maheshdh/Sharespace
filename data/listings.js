import { ObjectId } from "mongodb"
import {listings} from '../config/mongoCollections.js'


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
) 

export const deleteListing = async (
    listingID
)

export const modifyListing = async (
    listingID
)

export const  getAllListings = async() => {
    const listingsCollection = await listings();
    return await listingsCollection.find({}).toArray();
  };

