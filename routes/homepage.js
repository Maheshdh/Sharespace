import {Router} from 'express'
import {getAllListings} from '../data/listings.js';
import {makeSponsoredListings} from '../data/sponsoredListings.js'

const router = Router()
router.get('/', async (req, res) => {
    try {
        const listings = await getAllListings();
        let sponsoredListings = await makeSponsoredListings()
        let noSponsoredListings = false
        let noListings = false
        if (sponsoredListings.length == 0) {
            noSponsoredListings = true
        }
        if (listings.length == 0) {
            noListings = true
        }
        return res.render('homepage', {listings: listings, sponsoredListings: sponsoredListings, noListings: noListings, noSponsoredListings: noSponsoredListings});
    } catch (e) {
        res.status(500).send(e);
      }  });

export default router;