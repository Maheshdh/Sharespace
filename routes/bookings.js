import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js'
import xss from 'xss';
import { 
    createBookingRequest, 
    getBookingRequestsReceived, 
    getBookingRequestsSent, 
    respondToBookingRequestReceived,
    getContactInfoWhenBookingAccepted } from '../data/bookings.js';

router
.route('/')
.get(async (req, res) => {
    let currentUser = req.session.user
    try {
        let bookingsRequested = await getBookingRequestsSent(currentUser.userID)
        let bookingsReceived = await getBookingRequestsReceived(currentUser.userID)
        for (let booking of bookingsReceived) {
            if (booking.requestStatus == 'Requested') {
                booking.respondRequired = 'Yes'
            }
        }
        for (let booking of bookingsRequested) {
            if (booking.requestStatus == 'Request Accepted') {
                booking.listingOwnerContact = await getContactInfoWhenBookingAccepted(booking.listingUploadedByID)
            }
        }
        return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
    } catch (e) {
        res.render('errors', {errors: e})
    }
})
.post(async (req, res) => {
    let currentUser = req.session.user
    applyXSS(req.body);
    let userInput = req.body
    // Add line if (form) etc etc
    if (userInput.bookingStatusResponse) {
        let bookingStatusResponse = userInput.bookingStatusResponse
        if (bookingStatusResponse == 'Accept' || bookingStatusResponse == 'Deny') {}
        else {res.render('errors', {errors: 'Booking status can only be "Accept" or "Deny"'})}
        try {
            if (!userInput.bookingID) throw 'Error: Missing Booking ID'
            let bookingID = helpers.checkId(userInput.bookingID)
            let respondingToBookingRequest = await respondToBookingRequestReceived(bookingID, bookingStatusResponse)
            if (respondingToBookingRequest.responseUpdated != true) throw 'Could not respond to booking request'
            let bookingsRequested = await getBookingRequestsSent(currentUser.userID)
            let bookingsReceived = await getBookingRequestsReceived(currentUser.userID)
            // return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
            res.redirect('/bookings')
        } catch (e) {
            res.status(500).render('errors', {errors: e})
        }
    }
})

const applyXSS = (req_body) => {
    Object.keys(req_body).forEach(function (key, index) {
      req_body[key] = xss(req_body[key]);
    });
  };    

export default router;