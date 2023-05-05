import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import { getAllUsers, getUser } from '../data/users.js';
import { getListing } from '../data/listings.js';


router
.route('/')
.get(async (req, res) => {
    try {
        let users = await getAllUsers();
        return res.render('allUsers', {users:users});
    } catch (e) {
        res.status(500).send(e);
      }
})


router
.route('/:id')
.get(async (req, res) => {
    try {
    let userID = helpers.checkId(req.params.id, 'User ID');
    let userInfo = await getUser(userID)
    let currentUserListings = userInfo.listings
    let reviews = userInfo.reviews
    
        if (currentUserListings.length == 0){
            let noListings = 'User has no listings!'
            return res.render('user', {user:userInfo, reviews:[], noListings: noListings})
        }
        
        let allListings = []
        for (let listing of currentUserListings) {
            let listingToBeAdded = await getListing(listing)
            allListings.push(listingToBeAdded)
        }
        return res.render('user', {user:userInfo, listings: allListings, reviews: reviews})
    } catch (e) {
        res.status(500).send(e)
    }

})

export default router