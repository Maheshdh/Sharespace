import {Router} from 'express'
const router = Router()
import {createListing, getListing, modifyListing, deleteListing} from '../data/listings.js';
import { addReview, getReview } from '../data/reviews.js';
import helpers from '../helpers.js';
import {getUser, saveListing} from '../data/users.js';
import { getBookingRequestsReceived, getBookingRequestsSent, createBookingRequest } from '../data/bookings.js';
import { addListingCommentOrQuestion } from '../data/comments.js';
import { makeSponsoredListings } from '../data/sponsoredListings.js'
import { makeNewReport } from '../data/reportedListings.js'
import multer from 'multer';
const upload = multer({ dest: './public/data/uploads/' });

router
.route('/add')
.get(async(req,res) => {
    return res.render('addListing')
})
.post(upload.array('uploadFile'), async(req,res,next)=>{
    try {
      let userInput = req.body
      if (!userInput.listing_TitleInput) throw 'Error: Title not provided'
      if (!userInput.listing_DescriptionInput) throw 'Error: Description not provided'
      if (!userInput.listing_AddressInput) throw 'Error: Address not provided'
      if (!userInput.listing_PriceInput) throw 'Error: Price not provided'
      if (!userInput.listing_LengthInput) throw 'Error: Length not provided'
      if (!userInput.listing_WidthInput) throw 'Error: Width not provided'
      if (!userInput.listing_HeightInput) throw 'Error: Height not provided'
      if (!userInput.listing_AvailableStartInput) throw 'Error: Start Date not provided'
      if (!userInput.listing_AvailableEndInput) throw 'Error: End Date not provided'

      let userID = helpers.checkId(req.session.user.userID.toString())
      let titleInput = helpers.checkString(userInput.listing_TitleInput, 'Listing Title')
      let descriptionInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Description')
      let addressInput = helpers.checkString(userInput.listing_AddressInput, 'Listing Address')
      let priceInput = helpers.checkPrice(userInput.listing_PriceInput, 'Listing Price')
      let lenghtInput = helpers.checkDimension(userInput.listing_LengthInput, 'Listing Length')
      let widthInput = helpers.checkDimension(userInput.listing_WidthInput, 'Listing Width')
      let heightInput = helpers.checkDimension(userInput.listing_HeightInput, 'Listing Height')
      let longitudeInput = helpers.checkLongitude(parseFloat(userInput.listing_LongitudeInput),"Listing Longitutde")
      let latitudeInput = helpers.checkLatitude(parseFloat(userInput.listing_LatitudeInput),"Listing Latitude")
      let availableStartInput = helpers.checkDate(userInput.listing_AvailableStartInput, 'Listing Start Date')
      let availableEndInput = helpers.checkDate(userInput.listing_AvailableEndInput, 'Listing End Date')
      let a = new Date(availableStartInput);
      let b= new Date(availableEndInput);
      if(a>b) throw "Available end date is before available start date";
      let imageInput = [];
      if(req.files){
          for (let file of req.files) {
            imageInput.push(file.filename)
          }
        }


      let creatingListing = await createListing(userID, titleInput, descriptionInput, addressInput, priceInput, lenghtInput, widthInput, heightInput,  latitudeInput, longitudeInput, availableStartInput, availableEndInput, imageInput)
      if (!creatingListing) throw 'Error: Unable to create Listing'
      return res.render('listingAdded', {listingID: creatingListing})
    } catch (e) {
      return res.status(400).render('addListing', {error:e})
    }
})

router
    .route('/addReview')
    .post(async (req,res)=>{
        let userInput = req.body
        let userID;
        let listingID;
        let rating;
        let comment;
        if (!req.session.user) return res.json('Error: You must be logged in to add a review!')

        try {
            if (!userInput.listingID) throw 'Error: listingID not provided'
            if (userInput.rating === undefined) throw 'Error: Rating not provided'
            if (!userInput.comment) throw 'Error: Comment not provided'
    
            userID = helpers.checkId(req.session.user.userID.toString())
            listingID = helpers.checkId(userInput.listingID)
            rating = helpers.checkRating(userInput.rating, 'Rating')
            comment = helpers.checkString(userInput.comment, 'Comment////')   
        } catch (e) {
            // console.log(e);
            return res.json(e);
        }

        try {
            let myReview = await addReview(listingID, userID, rating, comment);
            if (!myReview) throw 'Error: Unable to create review'
            return res.json('added')
        } catch (e) {
            // console.log(e);
            return res.json(e);
        }
    })


router 
.route('/addCommentOrQuestion')
.post(async (req, res) => {
  try {
    let userInput = req.body
    if (!req.session.user) {
      return (res.render('login', {error: 'You need to be logged in to add a comment!'}))
    }
    let user = req.session.user
    let listingID = helpers.checkId(req.body.listing_id_input)
    if (!userInput.comment_question_input) throw 'Error: Missing Comment'
    let comment = helpers.checkString(userInput.comment_question_input, 'Comment/Question')
    let userInfo = await getUser(user.userID)
    let addingComment = await addListingCommentOrQuestion(listingID, comment, user.userID, `${userInfo.firstName} ${userInfo.lastName}`)
    if (addingComment.commentAdded == true) {
      return res.redirect(`/listing/${listingID}`)
    } else throw 'Unable to add comment'
  } catch (e) {
    return res.render('errors', {error:e})
  }
})



// TODO: FIX THIS -> make appropiate errors (FIXED)
router
  .route('/:id')
  .get(async (req,res) => {
      var id;
      try {
          id = helpers.checkId(req.params.id, 'Listing ID');
      } catch (e) {
          return res.status(400).render('errors',{"error":e});
      }
      var listing;
      try {
          listing = await getListing(id);
        } catch (e) {
            return res.status(404).render('errors',{"error":e});
        }
        var user_id;
      try {
        if (!listing) throw 'This listing does not exist or may have been deleted!'
        user_id = helpers.checkId(listing._id.toString());
      } catch (error) {
          return res.status(400).render('errors',{"error":error});
      }
      let reviews = []
      let noReviewsFound = false
      try {
        if (listing.reviews.length == 0) throw 'No Reviews Found!'
        for (let review of listing.reviews) {
          let reviewToBeAdded = await getReview(review)
          let userWhoReviewed = await getUser(reviewToBeAdded.userID)
          let userWhoReviewedName = userWhoReviewed.firstName + ' ' + userWhoReviewed.lastName
          reviewToBeAdded.fullName = userWhoReviewedName
          reviews.push(reviewToBeAdded)
        }
      } catch (e) {
        if (e === 'No Reviews Found!') {
          noReviewsFound = true 
        } else {
          return res.status(400).render('errors',{"error":e});
        }
      }
      try {
        const user = await getListing(user_id);
        let cumulativeListingReviewStats = {
          totalRating: 0,
          totalReviews: 0
        }
        if (reviews.length>0) {
          for (let review of reviews) {
            cumulativeListingReviewStats.totalRating += review.rating
          }
          cumulativeListingReviewStats.totalRating = cumulativeListingReviewStats.totalRating/reviews.length
          cumulativeListingReviewStats.totalRating = Math.round(cumulativeListingReviewStats.totalRating*100)/100
          cumulativeListingReviewStats.totalReviews = reviews.length
        }
        let noComments = false
        if (listing.comments.length == 0 ) {
          noComments = true 
        }
        let sponsoredListings = await makeSponsoredListings()
        let userInfo = await getUser(listing.userID)
        
        let userRoleIsAdmin = false
        let userRoleIsUser = true
        if (!req.session.user) {}
        else {
          let loggedInUser = req.session.user.userID
          let loggedInUserInfo = await getUser(loggedInUser)
          if (loggedInUserInfo.role == 'admin') {
              userRoleIsAdmin = true
              userRoleIsUser = false
          }
        } 
        return res.status(200).render('listing',{"sponsoredListings":sponsoredListings, "listing": listing,"userInfo": userInfo,"reviews": reviews, "noReviewsFound":noReviewsFound, "cumulativeListingReviewStats": cumulativeListingReviewStats, "comments": listing.comments, "noComments": noComments, userRoleIsUser: userRoleIsUser, userRoleIsAdmin: userRoleIsAdmin});
      } catch (error) {
          return res.status(404).render('errors',{"error":error});
      }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      let user = req.session.user
      let userInput = req.body
      var listingID;
      // console.log("requesting booking")
      try {
        listingID = helpers.checkId(req.params.id);
      } catch (e) {
          return res.status(400).render('errors',{"error":e});
      }
      var listingInfo;
      try {
        listingInfo = await getListing(listingID);
        } catch (e) {
            return res.status(404).render('errors',{"error":e});
        }
      var listingUploadedByID;
      try {
        listingUploadedByID = helpers.checkId(listingInfo.userID.toString());
      } catch (error) {
          return res.status(400).render('errors',{"error":error});
      }

      // Add if form() line
      if (userInput.requestBooking) {
        let userRequestingBookingID = helpers.checkId(user.userID)
        try {
          let creatingBooking = await createBookingRequest(listingID, userRequestingBookingID, listingUploadedByID)
          if (creatingBooking.insertedBookingRequestAndMyBooking == true) {
            let bookingsRequested = await getBookingRequestsSent(user.userID)
            let bookingsReceived = await getBookingRequestsReceived(user.userID)
            // return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
            return res.redirect('/bookings')
          } else throw 'Could not make booking'
        } catch (e) {
          return res.status(400).render('errors',{"error":e})
        }
      }

    } else {
      return res.render('login', {error: 'You need to be logged in to request booking!'})
    }
  })

router
.route('/update/:id')
.get(async (req, res) => {
  try{
    if (!req.session.user) throw 'Error: You must be logged in to modify listings!'
    let listingId =req.params.id;
    listingId = helpers.checkId(listingId,"Listing id");
    let listingInfo = await getListing(listingId);
    if (req.session.user.userID != listingInfo.userID) throw 'Error: You are not allowed to modify this listing because you do not own it'
    return res.render('updateListing',{listing: listingInfo});
  }
  catch(e){
    return res.render('errors', {error : e} )
  }

})
.post(upload.array('uploadFile'), async(req,res,next)=>{
  try {
    let userInput = req.body
    let listingId =req.params.id;
    listingId = helpers.checkId(listingId,"Listing id");
    if (!userInput.listing_Update_TitleInput) throw 'Error: Title not provided'
    if (!userInput.listing_Update_DescriptionInput) throw 'Error: Description not provided'
    if (!userInput.listing_Update_AddressInput) throw 'Error: Address not provided'
    if (!userInput.listing_Update_PriceInput) throw 'Error: Price not provided'
    if (!userInput.listing_Update_LengthInput) throw 'Error: Length not provided'
    if (!userInput.listing_Update_WidthInput) throw 'Error: Width not provided'
    if (!userInput.listing_Update_HeightInput) throw 'Error: Height not provided'
    if (!userInput.listing_Update_LongitudeInput) throw 'Error: Height not provided'
    if (!userInput.listing_Update_LatitudeInput) throw 'Error: Height not provided'
    if (!userInput.listing_Update_AvailableStartInput) throw 'Error: Start Date not provided'
    if (!userInput.listing_Update_AvailableEndInput) throw 'Error: End Date not provided'

    let titleInput = helpers.checkString(userInput.listing_Update_TitleInput, 'Listing Title')
    let descriptionInput = helpers.checkString(userInput.listing_Update_DescriptionInput, 'Listing Description')
    let addressInput = helpers.checkString(userInput.listing_Update_AddressInput, 'Listing Address')
    let priceInput = helpers.checkPrice(userInput.listing_Update_PriceInput, 'Listing Price')
    let lenghtInput = helpers.checkDimension(userInput.listing_Update_LengthInput, 'Listing Length')
    let widthInput = helpers.checkDimension(userInput.listing_Update_WidthInput, 'Listing Width')
    let heightInput = helpers.checkDimension(userInput.listing_Update_HeightInput, 'Listing Height')
    let longitudeInput = helpers.checkLongitude(parseFloat(userInput.listing_Update_LongitudeInput),"Listing Longitude")
    let latitudeInput = helpers.checkLatitude(parseFloat(userInput.listing_Update_LatitudeInput),"Listing Latitude");
    let availableStartInput = helpers.checkDate(userInput.listing_Update_AvailableStartInput, 'Listing Start Date')
    let availableEndInput = helpers.checkDate(userInput.listing_Update_AvailableEndInput, 'Listing End Date')
    let a = new Date(availableStartInput);
    let b= new Date(availableEndInput);
    if(a>b) throw "Available end date is before available start date";
    let imageInput = [];
    if(req.files){
        for (let file of req.files) {
          imageInput.push(file.filename)
        }
      }


    let creatingListing = await modifyListing(listingId, titleInput, descriptionInput, addressInput, priceInput, lenghtInput, widthInput, heightInput,  latitudeInput, longitudeInput, availableStartInput, availableEndInput, imageInput)
    if (!creatingListing) throw 'Error: Unable to create Listing'
    
    return res.render('listingUpdated',{listingID: listingId});
  } catch (e) {
    return res.status(400).render('addListing', {error:e})
  }
})

router
    .route('/save/:id')
    .post(async (req,res)=>{
        try {
          if (!req.session.user) return res.render('login', {error: 'You must be logged in to save listings!'})
          let userID = req.session.user.userID
          let listingID = req.params.id

          userID = helpers.checkId(userID.toString(), 'User ID')
          listingID = helpers.checkId(listingID,"Listing ID") 

          let savingListing = await saveListing(userID, listingID)

          if (savingListing.saved == true) {
            return res.render('listingSaved')
          }
        } catch (e) {
            return res.render('errors', {error: e});
        }
    })


router
.route('/delete/:id')
.post(async (req,res)=>{
    try {
      if (!req.session.user) return res.render('login', {error: 'You must be logged in to delete a listing!'})
      let userID = req.session.user.userID
      let listingID = req.params.id

      userID = helpers.checkId(userID.toString(), 'User ID')
      listingID = helpers.checkId(listingID,"Listing ID") 

      let listingInfo = await getListing(listingID)
      if (userID != listingInfo.userID) throw 'Error: This listing does not belong to you. You cannot delete it'

      let deletingListing = await deleteListing(listingID, userID)

      if (deletingListing.deleted == true) {
        return res.redirect('/profile')
      }
    } catch (e) {
        return res.render('errors', {error: e});
    }
})

router
.route('/report/:id')
.post(async (req, res) => {
  try {
    if (!req.session.user) return res.render('login', {error: 'You must be logged in to report a listing!'})
    let userID = req.session.user.userID
    let listingID = req.params.id
    let value = req.body.reportListing
    if (value != "Report this Listing") throw 'Error: You have entered an invalid value from a form where a value input is not required'

    userID = helpers.checkId(userID.toString(), 'User ID')
    listingID = helpers.checkId(listingID,"Listing ID") 

    let reporting = await makeNewReport(listingID, userID)
    if (reporting.reported == true) {
      return res.render('reportSubmitted')
    } else {
      return res.render('errors', {error:e})
    }
  } catch (e) {
    return res.render('errors', {error:e})
  }
})

export default router;