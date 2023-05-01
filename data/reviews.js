import { ObjectId } from "mongodb"
import { reviews } from '../config/mongoCollections.js'
import { listings } from "../config/mongoCollections.js"
import helpers from '../helpers.js'


export const addReview = async (listingID, userID, rating, comment) => {
    if (!listingID || !userID || !rating || !comment) throw 'Error: Invalid number of parameters entered (Expected 4)'

    if (!listingID) throw 'Error: "userID" parameter not entered'
    if (!userID) throw 'Error: "userID" parameter not entered'
    if (!rating) throw 'Error: "title" parameter not entered'
    if (!comment) throw 'Error: "description" parameter not entered'

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
