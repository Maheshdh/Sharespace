import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js'
import { 
    createBookingRequest, 
    getBookingRequestsReceived, 
    getBookingRequestsSent, 
    respondToBookingRequestReceived } from '../data/bookings.js';

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
        return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
    } catch (e) {
        res.render('errors', {errors: e})
    }
})
.post(async (req, res) => {
    let currentUser = req.session.user
    let userInput = req.body
    // Add line if (form) etc etc
    if (userInput.bookingStatusResponse) {
        let bookingStatusResponse = userInput.bookingStatusResponse
        if (bookingStatusResponse == 'Accept' || bookingStatusResponse == 'Deny') {}
        else {res.render('errors', {errors: 'Booking status can only be "Accep" or "Deny"'})}
        try {
            if (!userInput.bookingID) throw 'Error: Missing Booking ID'
            let bookingID = helpers.checkId(userInput.bookingID)
            let respondingToBookingRequest = await respondToBookingRequestReceived(bookingID, bookingStatusResponse)
            if (respondingToBookingRequest.responseUpdated != true) throw 'Could not respond to booking request'
            let bookingsRequested = await getBookingRequestsSent(currentUser.userID)
            let bookingsReceived = await getBookingRequestsReceived(currentUser.userID)
            return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
            // res.redirect('/bookings')
        } catch (e) {
            res.status(500).render('errors', {errors: e})
        }
    }
})

export default router;