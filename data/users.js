import { ObjectId } from "mongodb"
import {users} from '../config/mongoCollections.js'
import helpers from '../helpers.js'
import bcrypt from 'bcrypt'
import { getListing } from "./listings.js";
import { getReview } from "./reviews.js";

export const createUser = async (
    firstName,
    lastName,
    emailAddress,
    password,
    phoneNumber,
    imageInput
  ) => {
    if (!firstName || !lastName || !emailAddress || !password || !phoneNumber) throw 'Error: Invalid number of parameters entered (Expected 5)'
    if (!firstName) throw 'Error: "firstName" parameter not entered'
    if (!lastName) throw 'Error: "lastName" parameter not entered'
    if (!emailAddress) throw 'Error: "emailAddress" parameter not entered'
    if (!password) throw 'Error: "password" parameter not entered'
    if (!phoneNumber) throw 'Error: "phoneNumber" parameter not entered'
   
    let userCollection = await users()
  
    firstName = helpers.checkString(firstName, 'First Name')
    lastName = helpers.checkString(lastName, 'Last Name')
    emailAddress = helpers.checkEmail(emailAddress, 'Email Address')
    let checkForDuplicateEmailAddress = await userCollection.findOne({emailAddress: emailAddress})
    if (checkForDuplicateEmailAddress) throw `Error: An account already exists for ${emailAddress}`
    password = helpers.checkPassword(password, 'Password')
    phoneNumber = helpers.checkPhoneNumber(phoneNumber, 'Phone Number')
    let role = 'user'
    let hashedPassword = await bcrypt.hash(password, 10)
    
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      listings: [],
      rating: 0,
      reviews: []
      role: role,
      image: imageInput
    }
    
    let insertInfo = await userCollection.insertOne(newUser)
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add User' 
    return {insertedUser: true}
  };
  
  
export const checkUser = async (emailAddress, password) => {
    if (!emailAddress || !password) throw 'Error: invalid number of parameters entered (2 expected)'
    if (!emailAddress) throw 'Error: parameter "emailAddress" is missing'
    if (!password) throw 'Error: parameter "password" is missing'

    let userCollection = await users()

    emailAddress = helpers.checkEmail(emailAddress, 'Email Address')
    password = helpers.checkPassword(password, 'Password')
   
    let currentUser = await userCollection.findOne({emailAddress: emailAddress}) 

    if (!currentUser) throw 'Error: Either the email address or password is invalid'
    else {
      let currentUserInfo = {
        userID: currentUser._id,
        firstName: currentUser.firstName, 
        lastName: currentUser.lastName,
        emailAddress: currentUser.emailAddress,
        phoneNumber: currentUser.phoneNumber,
        listings: currentUser.listings,
        rating: currentUser.rating,
        reviews: currentUser.reviews,
        role: currentUser.role,
        image: currentUser.image
      }
      if (await bcrypt.compare(password, currentUser.password)) return (currentUserInfo)
      else throw `Error: Either the email address or password is invalid`
    }
  };

export const getUser = async (id) => {
    id = helpers.checkId(id, 'User ID');
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if(!user) throw "The user is not found";
    return user;
  };


export const updateUserRatingAndComments = async (id) => {
    id = helpers.checkId(id, "User ID");
    let user = await getUser(id)
    let userListingsIDs = user.listings //Array of strings where each string represents LISTING ID
  
    let userListingsInfo = [] //Contains INFORMATION of all listings made by User
    if (userListingsIDs.length == 0) return 'User has no active listings!'
    for (let listingID of userListingsIDs) {
      userListingsInfo.push(await getListing(listingID))
    }

    let reviewsOnUserIDs = [] //Array of strings where each string represents the REVIEW ID's made on EVERY listing made by user
    for (let listingInfo of userListingsInfo) {
      let allReviewsOnListing = listingInfo.reviews //Array of strings where each string represents REVIEW ID
      for (let reviewID of allReviewsOnListing) {
        reviewsOnUserIDs.push(reviewID)
      }
    }

    let allRatings = [] //Array of numbers where each number represents every RATING given to every listings made by user
    let allReviews = [] //Array of strings where each string represents every COMMENT made on every listings made by user
    for (let reviewID of reviewsOnUserIDs) {
      let reviewInfo = await getReview(reviewID)
      allRatings.push(reviewInfo.rating)
      let review = {
        reviewMadeBy: reviewInfo.userID, //This is the ID of the user who MADE the review/comment
        rating: reviewInfo.rating,
        comment: reviewInfo.comment
      }
      allReviews.push(review)
    }

    //Finding the Rating of the user by averaging 'allRatings'
    let totalSum = 0
    let count = 0
    for (let rating of allRatings) {
      totalSum += rating
    }
    let userRating = totalSum/(allRatings.length)
    let userRatingRoundedUp = Math.round(userRating*100)/100

    let userCollection = await users()
    console.log('Received user collection')
    let updateUser = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: {rating: userRatingRoundedUp, reviews:allReviews}}
    )
    console.log('Updated user collection')

    return true
}