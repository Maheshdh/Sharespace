import {Router} from 'express'
import {getAllListings} from '../data/listings.js';
const router = Router()
router.get('/', async (req, res) => {
    try {
        const listings = await getAllListings();
        return res.render('homepage', { listings });
    } catch (e) {
        res.status(500).send(e);
      }  });

export default router;