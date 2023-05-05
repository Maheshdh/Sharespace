import { ObjectId } from "mongodb"
import { listings } from '../config/mongoCollections.js'
import helpers from '../helpers.js'


export const addSponsoredPrice = async (listingID, pay) => {
    if (!listingID) throw 'Error: listing ID is not provided'

    listingID = helpers.checkId(listingID, 'Listing ID')
    pay = helpers.checkSponsorPrice(pay.toString(), 'Sponsored Payment')

    let listingCollection = await listings()
    let updatingListing = await listingCollection.findOneAndUpdate(
        {_id: new ObjectId(listingID)},
        {$set: {sponsorPay: pay}}
    )

    let listing = await listingCollection.findOne({_id: new ObjectId(listingID)})
    return ({added: true, listing: listing})
}


export const makeSponsoredListings = async () => {
    let listingCollection = await listings()

    let tierOneListings = await listingCollection.find({sponsorPay: {$gte: 100}}).toArray()
    let tierTwoListings = await listingCollection.find({sponsorPay: {$lt: 100, $gte:50}}).toArray()
    let tierThreeListings = await listingCollection.find({sponsorPay: {$lt: 50, $gte:1}}).toArray()

    let finalListings = []
    
    // Making tierOne listings array
    if (tierOneListings.length > 0) {
        let lengthUsedForMathRandom = tierOneListings.length - 1 //because Math.random will never be 1
        var tierOneListing1 = tierOneListings[Math.floor(Math.random()*lengthUsedForMathRandom)]
        let index = tierOneListings.indexOf(tierOneListing1)
        if (index > -1) {
            tierOneListings.splice(index, 1)
        }
    }
    if (tierOneListings.length > 0) {
        let lengthUsedForMathRandom = tierOneListings.length - 1 //because Math.random will never be 1
        var tierOneListing2 = tierOneListings[Math.floor(Math.random()*lengthUsedForMathRandom)]
        let index = tierOneListings.indexOf(tierOneListing2)
        if (index > -1) {
            tierOneListings.splice(index, 1)
        }
    }
    if (tierOneListing1) {finalListings.push(tierOneListing1)}
    if (tierOneListing2) {finalListings.push(tierOneListing2)}


    // Making tierTwo listings array
    if (tierTwoListings.length > 0) {
        let lengthUsedForMathRandom = tierTwoListings.length - 1 //because Math.random will never be 1
        var tierTwoListing1 = tierTwoListings[Math.floor(Math.random()*lengthUsedForMathRandom)]
        let index = tierTwoListings.indexOf(tierTwoListing1)
        if (index > -1) {
            tierTwoListings.splice(index, 1)
        }
    }
    if (tierTwoListing1) (finalListings.push(tierTwoListing1))

    // Making tierThree listings array
    if (tierThreeListings.length > 0) {
        let lengthUsedForMathRandom = tierThreeListings.length - 1 //because Math.random will never be 1
        var tierThreeListing1 = tierThreeListings[Math.floor(Math.random()*lengthUsedForMathRandom)]
        let index = tierThreeListings.indexOf(tierThreeListing1)
        if (index > -1) {
            tierThreeListings.splice(index, 1)
        }
    }
    
    if (tierThreeListing1) (finalListings.push(tierThreeListing1)) 


    return (finalListings)
}