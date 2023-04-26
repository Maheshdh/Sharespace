import { ObjectId } from "mongodb"
import {listings} from '../config/mongoCollections.js'


export const createListing = aynsc (
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

