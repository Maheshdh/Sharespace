import {Router} from 'express'
const router = Router()
import {createListing, getListing} from '../data/listings.js';
import { addReview, getReview } from '../data/reviews.js';
import helpers from '../helpers.js';
import {getUser} from '../data/users.js';
import { getBookingRequestsReceived, getBookingRequestsSent, createBookingRequest } from '../data/bookings.js';
import { addListingCommentOrQuestion } from '../data/comments.js';
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
      let longitudeInput = parseFloat(userInput.listing_LongitudeInput)
      let latitudeInput = parseFloat(userInput.listing_LatitudeInput)
      let availableStartInput = helpers.checkDate(userInput.listing_AvailableStartInput, 'Listing Start Date')
      let availableEndInput = helpers.checkDate(userInput.listing_AvailableEndInput, 'Listing End Date')
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
            console.log(e);
            return res.json(e);
        }

        try {
            let myReview = await addReview(listingID, userID, rating, comment);
            if (!myReview) throw 'Error: Unable to create review'
            return res.json('added')
        } catch (e) {
            console.log(e);
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
      res.redirect(`/listing/${listingID}`)
    } else throw 'Unable to add comment'
  } catch (e) {
    res.render('errors', {error:e})
  }
})



// TODO: FIX THIS -> make appropiate errors
router
  .route('/:id')
  .get(async (req,res) => {
      var id;
      try {
          id = helpers.checkId(req.params.id);
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
        return res.status(200).render('listing',{"listing": listing,"user": listing.userID,"reviews": reviews, "noReviewsFound":noReviewsFound, "cumulativeListingReviewStats": cumulativeListingReviewStats, "comments": listing.comments, "noComments": noComments});
      } catch (error) {
          return res.status(404).render('errors',{"error":error});
      }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      let user = req.session.user
      let userInput = req.body
      var listingID;
      console.log("requesting booking")
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
            res.redirect('/bookings')
          } else throw 'Could not make booking'
        } catch (e) {
          return res.status(400).render('errors',{"error":e})
        }
      }

    } else {
      res.render('login', {error: 'You need to be logged in to request booking!'})
    }
  })


export default router;