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
      reviews: [],
      role: role,
      savedListings: [],
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

export const getAllUsers = async() => {
  const userCollection = await users();
  const allUsers = await userCollection.find({role: 'user'}).toArray()
  return allUsers;
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
    // console.log('Received user collection')
    let updateUser = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: {rating: userRatingRoundedUp, reviews:allReviews}}
    )
    // console.log('Updated user collection')

    return true
}


export const countUsers = async() => {
  let userCollection = await users()
  return userCollection.countDocuments()
}

export const updateUser = async (
  firstName,
  lastName,
  phoneNumber,
  imageInput,
  emailAddress
) => {
  if (!firstName || !lastName || !phoneNumber) throw 'Error: Invalid number of parameters entered (Expected 5)'
  if (!firstName) throw 'Error: "firstName" parameter not entered'
  if (!lastName) throw 'Error: "lastName" parameter not entered'
  if (!phoneNumber) throw 'Error: "phoneNumber" parameter not entered'
  if (!emailAddress) throw 'Error: "emailAddress" parameter not entered'
 
  let userCollection = await users()

  firstName = helpers.checkString(firstName, 'First Name')
  lastName = helpers.checkString(lastName, 'Last Name')
  phoneNumber = helpers.checkPhoneNumber(phoneNumber, 'Phone Number')
  emailAddress = helpers.checkEmail(emailAddress,"update email address");
  let existingUser = await userCollection.findOne({emailAddress: emailAddress})
  if (existingUser){
    if(imageInput==null){
      imageInput = existingUser.image;
    }
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: existingUser.emailAddress,
      password: existingUser.password,
      phoneNumber: phoneNumber,
      listings: existingUser.listings,
      rating: existingUser.rating,
      reviews: existingUser.reviews,
      role: existingUser.role,
      savedListings: existingUser.savedListings,
      image: imageInput
    }
    // console.log(newUser);
    let updateInfo = await userCollection.findOneAndUpdate(
      {_id: existingUser._id},
      {$set: newUser},
      {returnDocument: 'after'}
    )
    // console.log(updateInfo)
    if(updateInfo.lastErrorObject.n === 0){
      throw "update Failed";
    }
    return updateInfo.value;
  }
  else{
    throw "No user with this email to update";
  }
}

export const saveListing = async (userID, listingID) => {
  if (!userID || !listingID) throw 'Error: Invalid number of parameters entered (expected 2)'
  if (!userID) throw 'Error: User ID not provided'
  if (!listingID) throw 'Error: Listing ID not provided'

  userID = helpers.checkId(userID, 'User ID')
  listingID = helpers.checkId(listingID, 'Listing ID')

  let userCollection = await users()
  let userInfo = await userCollection.findOne({_id: new ObjectId(userID)})
  
  let previouslySavedListings = userInfo.savedListings
  if (previouslySavedListings.includes(listingID)) {throw 'You have saved this listing already!'}

  let savingListing = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(userID)},
    {$push : {savedListings: listingID}}
    )
  
  return ({saved: true})
}

export const unsaveListing = async (userID, listingID) => {
  if (!userID || !listingID) throw 'Error: Invalid number of parameters entered (expected 2)'
  if (!userID) throw 'Error: User ID not provided'
  if (!listingID) throw 'Error: Listing ID not provided'

  userID = helpers.checkId(userID, 'User ID')
  listingID = helpers.checkId(listingID, 'Listing ID')

  let userCollection = await users()
  let userInfo = await userCollection.findOne({_id: new ObjectId(userID)})
  
  let previouslySavedListings = userInfo.savedListings
  let index = previouslySavedListings.indexOf(listingID)
  if (index > -1) {
    previouslySavedListings.splice(index, 1)
  } else throw 'You did not have this listing saved'

  let unsavingListing = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(userID)},
    {$set : {savedListings: previouslySavedListings}}
    )
  
  return ({unsaved: true})
}
