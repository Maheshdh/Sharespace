import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import { getListing } from '../data/listings.js';


router
.route('/')
.get(async (req, res) => {
    let currentUser = req.session.user
    let currentUserListings = currentUser.listings
    try {
        if (currentUserListings.length == 0){
            let noListings = 'You have no listings!'
            return res.render('profile', {user:currentUser, listings: noListings})
        }
        
        let allListings = []
        for (let listing of currentUserListings) {
            let listingToBeAdded = await getListing(listing)
            allListings.push(listingToBeAdded)
        }
        return res.render('profile', {user:currentUser, listings: allListings})
    } catch (e) {
        res.status(500).send(e)
    }

})

export default router