import {Router} from 'express'
import {getAllListings} from '../data/listings.js';
import {makeSponsoredListings} from '../data/sponsoredListings.js'

const router = Router()
router.get('/', async (req, res) => {
    try {
        const listings = await getAllListings();
        let sponsoredListings = await makeSponsoredListings()
        let atLeastOneSponsoredListing = true
        if (sponsoredListings.length == 0) {
            atLeastOneSponsoredListing = false
        }
        return res.render('homepage', {listings: listings, sponsoredListings: sponsoredListings, atLeastOneSponsoredListing: atLeastOneSponsoredListing});
    } catch (e) {
        res.status(500).send(e);
      }  });

export default router;