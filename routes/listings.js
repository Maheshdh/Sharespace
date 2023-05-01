import {Router} from 'express'
const router = Router()
import {createListing, getListing} from '../data/listings.js';
import { addReview, getReview } from '../data/reviews.js';
import helpers from '../helpers.js';
import {getUser} from '../data/users.js';
import multer from 'multer';
const upload = multer({ dest: './public/data/uploads/' });

router
.route('/add')
.get(async(req,res) => {
    return res.render('addListing')
})
.post(upload.single('uploadFile'), async(req,res,next)=>{
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
      let longitudeInput = 'LONGITUDE GOES HERE'
      let latitudeInput = 'LATITUDE GOES HERE'
      let availableStartInput = helpers.checkDate(userInput.listing_AvailableStartInput, 'Listing Start Date')
      let availableEndInput = helpers.checkDate(userInput.listing_AvailableEndInput, 'Listing End Date')
      let imageInput = null;
      if(req.file){
          imageInput = req.file.filename; 
        }


      let creatingListing = await createListing(userID, titleInput, descriptionInput, addressInput, priceInput, lenghtInput, widthInput, heightInput, longitudeInput, latitudeInput, availableStartInput, availableEndInput, imageInput)
      if (!creatingListing) throw 'Error: Unable to create Listing'
      return res.render('listingAdded', {listingID: creatingListing})
    } catch (e) {
      return res.status(400).render('addListing', {error:e})
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
      try {
        for (let review of listing.reviews) {
          let reviewToBeAdded = await getReview(review)
          reviews.push(reviewToBeAdded)
        }
      } catch (e) {
        if (e === 'No Reviews Found!') {
          reviews = e
        } else {
          return res.status(400).render('errors',{"error":e});
        }
      }
      try {
        const user = await getListing(user_id);
        return res.status(200).render('listing',{"listing": listing,"user": listing.userID,"reviews": reviews});
      } catch (error) {
          return res.status(404).render('errors',{"error":error});
      }
  })

router
    .route('/addReview')
    .post(async(req,res)=>{
        let userInput = req.body

        if (!userInput.listingID) throw 'Error: listingID not provided'
        if (!userInput.rating) throw 'Error: Rating not provided'
        if (!userInput.comment) throw 'Error: Comment not provided'

        let userID = helpers.checkId(req.session.user.userID.toString())
        let listingID = helpers.checkId(userInput.listingID)
        let rating = helpers.checkRating(userInput.rating, 'Rating')
        let comment = helpers.checkString(userInput.comment, 'Comment////')

        try {
            let myReview = await addReview(listingID, userID, rating, comment);
            if (!myReview) throw 'Error: Unable to create review'
            myReview = await getReview(myReview)
            return res.json(myReview);
        } catch (error) {
            return error;
        }
    })

export default router;