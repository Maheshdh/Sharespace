import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import {users} from '../config/mongoCollections.js'
import { getListing } from '../data/listings.js';
import { getUser, updateUser, unsaveListing } from '../data/users.js';
import { addSponsoredPrice } from '../data/sponsoredListings.js'
import multer from 'multer';
import xss from 'xss';
const upload = multer({ dest: './public/data/uploads/' });

router
.route('/')
.get(async (req, res) => {
    try {
        let currentUser = req.session.user
        let currentUserID = req.session.user.userID
        currentUserID = helpers.checkId(currentUserID, 'User ID')
        let currentUserInfo = await getUser(currentUserID)
        let currentUserListings = currentUserInfo.listings
        let currentUserSavedListings = currentUserInfo.savedListings
        let reviews = currentUser.reviews

        let allListings = []
        let savedListings = []
        let noListings = false
        let noSavedListings = false
        let isAdmin = false

        if (currentUserListings.length == 0) {
            noListings = true
        }
        if (currentUserSavedListings.length == 0) {
            noSavedListings = true
        }

        for (let listing of currentUserListings) {
            let listingToBeAdded = await getListing(listing)
            allListings.push(listingToBeAdded)
        }
        for (let listing of currentUserSavedListings) {
            let listingToBeAdded = await getListing(listing)
            savedListings.push(listingToBeAdded)
        }

        if (currentUserInfo.role == "admin") {
            isAdmin = true
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

        return res.render('profile', {user:currentUser, listings: allListings, reviews: reviewsShownInProfile, noReviewsFound: noReviewsFound, savedListings: savedListings, noListings: noListings, noSavedListings: noSavedListings, isAdmin: isAdmin})
    } catch (e) {
        return res.status(500).send(e)
    }

})

router
.route('/update')
.get(async (req, res) => {
    let currentUser =req.session.user;
    return res.render('profileUpdate',{user: currentUser});
})
.post(upload.single('updateProfilePic'),async (req,res) => {
    try {
        applyXSS(req.body)
        let userInput = req.body
        if (!userInput.firstname_update) throw `Error: First Name not provided`
        if (!userInput.lastname_update) throw 'Error: Last Name not provided'
        if (!userInput.phoneno_update) throw 'Error: Phone number not provided'

        let firstNameInput = helpers.checkString(userInput.firstname_update, 'First Name')
        let lastNameInput = helpers.checkString(userInput.lastname_update, 'Last Name')
        let phoneNumberInput = helpers.checkPhoneNumber(userInput.phoneno_update, 'Phone Number')
        let userCollection = await users()
        let existingUser = await userCollection.findOne({emailAddress: req.session.user.emailAddress})
        if(!existingUser){
            return res.status(404).render('profileUpdate',{error: "The user is not present"})
        }
        let imageInput = existingUser.image;
        if(req.file){
        imageInput = req.file.filename; 
        }
        let updateInfo = updateUser(firstNameInput,lastNameInput,phoneNumberInput,imageInput,req.session.user.emailAddress);
        req.session.user.firstName = firstNameInput;
        req.session.user.lastName = lastNameInput;
        req.session.user.phoneNumber = phoneNumberInput;
        req.session.user.image = imageInput;
        return res.status(200).redirect('/profile')

    } catch (e) {
        // console.log(e);
        let currentUser = req.session.user;
        return res.status(400).render('profileUpdate',{error: e,user: currentUser});
    }
})

router
.route('/boostListing/:id')
.get(async (req, res) => {
    try {
        let currentUser = req.session.user
        let listingID = req.params.id

        currentUser = helpers.checkId(currentUser.userID, 'User ID')
        listingID = helpers.checkId(listingID, 'Listing ID')

        let listingInfo = await getListing(listingID)
        return res.render('sponsorListing', {listing: listingInfo})
    } catch (e) {
        return res.render('errors', {error:e})
    }

})
.post(async (req, res) => {
    try {
        applyXSS(req.body)
        let userInput = req.body
        let listingID = helpers.checkId(req.params.id, 'Listing ID')

        if (!userInput.sponsorPayInput) throw 'Error: New pay not provided'
        let sponsorPayInput = helpers.checkSponsorPrice(userInput.sponsorPayInput.toString(), 'Sponsored Payment')
        
        let listingInfo = await getListing(listingID)

        let addingSponsorPay = await addSponsoredPrice(listingID, sponsorPayInput)
        if (addingSponsorPay.added == true) {
            return res.render('sponsorListing', {success: true, listing: addingSponsorPay.listing})
        }
    } catch (e) {
        return res.render('errors', {error: e})
    }
})

router
.route('/unsave/:id')
.post(async (req, res) => {
    try {
        let userID = req.session.user.userID
        let listingID = req.params.id

        userID = helpers.checkId(userID.toString(), 'User ID')
        listingID = helpers.checkId(listingID,"Listing ID") 

        let unsavingListing = await unsaveListing(userID, listingID)

        if (unsavingListing.unsaved == true) {
          return res.redirect('/profile')
        }
      } catch (e) {
          return res.render('errors', {error: e});
      }

})
const applyXSS = (req_body) => {
    Object.keys(req_body).forEach(function (key, index) {
      req_body[key] = xss(req_body[key]);
    });
  };    

export default router