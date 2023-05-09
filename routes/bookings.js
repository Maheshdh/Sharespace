import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js'
import { 
    createBookingRequest, 
    getBookingRequestsReceived, 
    getBookingRequestsSent, 
    respondToBookingRequestReceived,
    getContactInfoWhenBookingAccepted } from '../data/bookings.js';
import { getListing } from '../data/listings.js';
import { getUser } from '../data/users.js'

router
.route('/')
.get(async (req, res) => {
    let currentUser = req.session.user
    try {
        let bookingsRequested = await getBookingRequestsSent(currentUser.userID)
        if (bookingsRequested == 'No Booking Requests Sent') {bookingsRequested = []}
        let bookingsReceived = await getBookingRequestsReceived(currentUser.userID)
        if (bookingsReceived == 'No Booking Requests Received') {bookingsReceived = []}

        for (let booking of bookingsReceived) {
            if (booking.requestStatus == 'Requested') {
                booking.respondRequired = 'Yes'
            }
            let listingInfo = await getListing(booking.listingID)
            let userRequestingBookingInfo = await getUser(booking.userRequestingBookingID)
            if (listingInfo) {booking.listingTitle = listingInfo.title} else {booking.listingTitle = 'Link to listing'}
            if (userRequestingBookingInfo) {booking.userRequestingBookingName = userRequestingBookingInfo.firstName + ' ' + userRequestingBookingInfo.lastName} else {booking.userRequestingBookingName = 'Link to user'}
        }
        for (let booking of bookingsRequested) {
            if (booking.requestStatus == 'Request Accepted') {
                booking.listingOwnerContact = await getContactInfoWhenBookingAccepted(booking.listingUploadedByID)
            }
            let listingInfo = await getListing(booking.listingID)
            if (listingInfo) {booking.listingTitle = listingInfo.title} else {booking.listingTitle = 'Link to listing'}
        }

        return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
    } catch (e) {
        return res.render('errors', {error: e})
    }
})
.post(async (req, res) => {
    let currentUser = req.session.user
    let userInput = req.body
    // Add line if (form) etc etc
    if (userInput.bookingStatusResponse) {
        let bookingStatusResponse = userInput.bookingStatusResponse
        if (bookingStatusResponse == 'Accept' || bookingStatusResponse == 'Deny') {}
        else {return res.render('errors', {errors: 'Booking status can only be "Accept" or "Deny"'})}
        try {
            if (!userInput.bookingID) throw 'Error: Missing Booking ID'
            let bookingID = helpers.checkId(userInput.bookingID)
            let respondingToBookingRequest = await respondToBookingRequestReceived(bookingID, bookingStatusResponse)
            if (respondingToBookingRequest.responseUpdated != true) throw 'Could not respond to booking request'
            let bookingsRequested = await getBookingRequestsSent(currentUser.userID)
            let bookingsReceived = await getBookingRequestsReceived(currentUser.userID)
            // return res.render('bookings', {bookingsRequested: bookingsRequested, bookingsReceived: bookingsReceived})
            return res.redirect('/bookings')
        } catch (e) {
            return res.status(500).render('errors', {errors: e})
        }
    }
})

export default router;