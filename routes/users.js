import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import { getAllUsers, getUser } from '../data/users.js';
import { getListing } from '../data/listings.js';
import xss from 'xss';


router
.route('/')
.get(async (req, res) => {
    try {
        let users = await getAllUsers();
        return res.render('allUsers', {users:users});
    } catch (e) {
        return res.status(500).send(e);
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
    
        let noListings = false
        if (currentUserListings.length == 0){
            noListings = true
        }
        
        let allListings = []
        for (let listing of currentUserListings) {
            let listingToBeAdded = await getListing(listing)
            allListings.push(listingToBeAdded)
        }

        let reviewsShownInProfile = []
        let noReviewsFound = false
        if (reviews.length == 0) {
            noReviewsFound = true
        } else {
            for (let review of reviews) {
                let reviewToBeAdded = review
                let userWhoReviewed = await getUser(review.reviewMadeBy)
                let userWhoReviewedName = userWhoReviewed.firstName + ' ' + userWhoReviewed.lastName
                reviewToBeAdded.fullName = userWhoReviewedName
                reviewsShownInProfile.push(reviewToBeAdded)
            }
        }
        return res.render('user', {user:userInfo, listings: allListings, reviews: reviewsShownInProfile, noListings: noListings, noReviewsFound: noReviewsFound})
    } catch (e) {
        return res.status(500).render('errors', {error: e})
    }

})

export default router