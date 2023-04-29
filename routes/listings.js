import {Router} from 'express'
const router = Router()
import {createListing, getListing} from '../data/listings.js';
import {getUser} from '../data/users.js';
import helpers from '../helpers.js';

router
.route('/add')
.get(async(req,res) => {
    res.render('addListing')
})
.post(async(req,res)=>{
    try {
      let userInput = req.body
      if (!userInput.listing_AddressInput) throw 'Error: Address not provided'
      if (!userInput.listing_DescriptionInput) throw 'Error: Description not provided'
      if (!userInput.listing_PriceInput) throw 'Error: Price not provided'
      if (!userInput.listing_LengthInput) throw 'Error: Length not provided'
      if (!userInput.listing_WidthInput) throw 'Error: Width not provided'
      if (!userInput.listing_HeightInput) throw 'Error: Height not provided'
      if (!userInput.listing_AvailableStartInput) throw 'Error: Start Date not provided'
      if (!userInput.listing_AvailableEndInput) throw 'Error: End Date not provided'

      let addressInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Address')
      let descriptionInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Description')
      let priceInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Price')
      let lenghtInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Length')
      let widthInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Width')
      let heightInput = helpers.checkString(userInput.listing_HeightInput, 'Listing Height')
      let longitudeInput = 'LONGITUDE GOES HERE'
      let latitudeInput = 'LATITUDE GOES HERE'
      let availableStartInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing Start Date')
      let availableEndInput = helpers.checkString(userInput.listing_DescriptionInput, 'Listing End Date')

      let creatingListing = await createListing(addressInput, descriptionInput, priceInput, lenghtInput, widthInput, heightInput, longitudeInput, latitudeInput, availableStartInput, availableEndInput)
      if (!creatingListing) throw 'Error: Unable to create Listing'
      res.render('listingAdded', {listingID: creatingListing})
    } catch (e) {
      res.status(400).render('addListing', {error:e})
    }
})

router
  .route('/:id')
  .get(async (req,res) => {
      var id;
      console.log("Listing ID get")
      try {
          id = helpers.checkId(req.params.id);
      } catch (e) {
          console.log(e);
          res.status(400).render('error',{"error":e});
      }
      console.log(id);
      var listing;
      try {
          listing = await getListing(id);
        } catch (e) {
            console.log(e);
            res.status(404).render('error',{"error":e});
        }
        var user_id;
          try {
              user_id = helpers.checkId(listing.user_id);
          } catch (error) {
            console.log(error);
            res.status(400).render('errors',{"error":error});
          }
          try {
            const user = await getUser(user_id);
            res.status(200).render('listing',{"listing": listing,"user": user});
          } catch (error) {
              console.log(error)
              res.status(404).render('error',{"error":error});
          }

  })


export default router;