import { ObjectId } from "mongodb"
import { reviews } from '../config/mongoCollections.js'
import { listings } from "../config/mongoCollections.js"
import helpers from '../helpers.js'
import { updateUserRatingAndComments } from "./users.js"


export const addReview = async (listingID, userID, rating, comment) => {
    if (!listingID || !userID || rating === undefined || !comment) throw 'Error: Invalid number of parameters entered (Expected 4)'

    if (!listingID) throw 'Error: "listingID" parameter not entered'
    if (!userID) throw 'Error: "userID" parameter not entered'
    if (rating === undefined) throw 'Error: "rating" parameter not entered'
    if (!comment) throw 'Error: "comment" parameter not entered'

    listingID = helpers.checkId(listingID, 'User ID')
    userID = helpers.checkId(userID, 'User ID')
    rating = helpers.checkRating(rating, 'Rating')
    comment = helpers.checkString(comment, 'Comment$$$$$$')

    let reviewCollection = await reviews()
    let listingCollection = await listings()
    
    let reviewObject = {
        listingID: listingID,
        userID: userID,
        rating: rating,
        comment: comment
    }

    let listingReviewed = await listingCollection.findOne({_id: new ObjectId(listingID)})
    let listingUploadedBy = listingReviewed.userID
    if (userID == listingUploadedBy) throw 'Error: You cannot leave a review for your own listing!'
    
    let previousReviewsOnListing = listingReviewed.reviews
    let previousUsersWhoReviewedListing = []
    for (let reviewID of previousReviewsOnListing) {
        let review = await reviewCollection.findOne({_id: new ObjectId(reviewID)})
        let userID = review.userID
        previousUsersWhoReviewedListing.push(userID)
    }
    if (previousUsersWhoReviewedListing.includes(userID)) throw 'Error: You cannot review this listing again!'
    

    let addingReview = await reviewCollection.insertOne(reviewObject);
    if (!addingReview.acknowledged || !addingReview.insertedId) throw 'Error: Could not add listing'
    let reviewID =  addingReview.insertedId.toString()

    let updatingListing = await listingCollection.findOneAndUpdate(
        {_id: new ObjectId(listingID)},
        {$push: {reviews: reviewID}}
    )

    let updatingUserWhoUploadedTheListing = await updateUserRatingAndComments(listingUploadedBy)

    return reviewID
}

// export const deleteReview = async (
//     reviewID
// )

// export const modifyReview = async (
//     reviewID
// )

export const getReview = async(id) => {
    id = helpers.checkId(id, "Review ID");
    let reviewsCollection = await reviews();
    let review = await reviewsCollection.findOne({_id: new ObjectId(id)})
    if (!review) throw 'No Reviews Found!'
    return review
}

// This Function may not work as expected
// IT IS NOT USED ANYWHERE AS OF YET!
export const getAllReviewsBasedOnListingID = async(id) => {
    id = helpers.checkId(id, 'Listing ID')
    let reviewsCollection = await reviews()
    // Check if this works or no for multiple reviews. It should return an array
    let reviewsOnListing = await reviewsCollection.find({}, {projection: {listingID: id}}).toArray()
    return reviewsOnListing

}