import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import {users} from '../config/mongoCollections.js'
import { getListing } from '../data/listings.js';
import { updateUser } from '../data/users.js';
import multer from 'multer';
const upload = multer({ dest: './public/data/uploads/' });

router
.route('/')
.get(async (req, res) => {
    let currentUser = req.session.user
    let currentUserListings = currentUser.listings
    let reviews = currentUser.reviews
    try {
        if (currentUserListings.length == 0){
            let noListings = 'You have no listings!'
            return res.render('profile', {user:currentUser, reviews:[], noListings: noListings})
        }
        
        let allListings = []
        for (let listing of currentUserListings) {
            let listingToBeAdded = await getListing(listing)
            allListings.push(listingToBeAdded)
        }
        return res.render('profile', {user:currentUser, listings: allListings, reviews: reviews})
    } catch (e) {
        res.status(500).send(e)
    }

})

router
.route('/update')
.get(async (req, res) => {
    let currentUser =req.session.user;
    res.render('profileUpdate',{user: currentUser});
})
.post(upload.single('updateProfilePic'),async (req,res) => {
    try {
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
        console.log(e);
        let currentUser = req.session.user;
        return res.status(400).render('profileUpdate',{error: e,user: currentUser});
    }
})

export default router