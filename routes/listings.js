import {Router} from 'express'
const router = Router()
import {createListing, getListing, addComment, getListingComments} from '../data/listings.js';
import helpers from '../helpers.js';
import {getUser} from '../data/users.js';

router
.route('/add')
.get(async(req,res) => {
    return res.render('addListing')
})
.post(async(req,res)=>{
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

      let creatingListing = await createListing(userID, titleInput, descriptionInput, addressInput, priceInput, lenghtInput, widthInput, heightInput, longitudeInput, latitudeInput, availableStartInput, availableEndInput)
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
          console.log(e);
          return res.status(400).render('errors',{"error":e});
      }
      var listing;
      try {
          listing = await getListing(id);
        } catch (e) {
            console.log(e);
            return res.status(404).render('errors',{"error":e});
        }
        var user_id;
      try {
        user_id = helpers.checkId(listing._id.toString());
      } catch (error) {
          console.log(error);
          return res.status(400).render('errors',{"error":error});
      }
      var comments;
      try {
          comments = await getListingComments(id);
      } catch (e) {
        console.log(e);
        return res.status(400).render('errors',{"error":e});
      }
      try {
        const user = await getListing(user_id);
        return res.status(200).render('listing',{"listing": listing,"user": listing.userID,"comments": comments});
      } catch (error) {
          console.log(error)
          return res.status(404).render('errors',{"error":error});
      }
  })

router
    .route('/addComment')
    .post(async(req,res)=>{
        let comment = req.body.comment;
        let rating = req.body.rating;
        let listingId = req.body.listingId;
        try {
            const myComment = await addComment(comment,rating,listingId);
            return res.json(myComment);
        } catch (error) {
            console.log(error);
            return error;
        }

    })

export default router;