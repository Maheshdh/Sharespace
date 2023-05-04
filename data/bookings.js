import { ObjectId } from "mongodb"
import { bookingRequests } from '../config/mongoCollections.js'
import { myBookings } from "../config/mongoCollections.js"
import { listings } from "../config/mongoCollections.js"
import { users } from "../config/mongoCollections.js"
import helpers from '../helpers.js'

export const createBookingRequest = async (
    listingID,
    userRequestingBookingID,
    listingUploadedByID,
) => {
    if (!listingID || !userRequestingBookingID || !listingUploadedByID) throw 'Error: Invalid number of parameters entered. (3) parameters expected'
    if (!listingID) throw 'Error: "listingID" parameter not entered'
    if (!userRequestingBookingID) throw 'Error: "userRequestingBookingID" parameter not entered'
    if (!listingUploadedByID) throw 'Error: "listingUploadedByID" parameter not entered'

    listingID = helpers.checkId(listingID, 'Listing ID')
    userRequestingBookingID = helpers.checkId(userRequestingBookingID, 'User ID')
    listingUploadedByID = helpers.checkId(listingUploadedByID, 'User who uploaded the Listing ID')
    let requestStatus = 'Requested'

    let bookingRequestsCollection = await bookingRequests()
    let myBookingCollection = await myBookings()
    let userCollection = await users()

    let userRequestingBookingInfo = await userCollection.findOne({_id: new ObjectId(userRequestingBookingID)})
    let listingsOfUserRequestingBooking = userRequestingBookingInfo.listings
    if (listingsOfUserRequestingBooking.includes(listingID)) {
        throw 'Error: You cannot create a booking for your own listing!'
    }

    let duplicateBookingRequest = await myBookingCollection.findOne(
        {$and: [
            {listingID: listingID},
            {userRequestingBookingID: userRequestingBookingID}
        ]}
    )
    if (duplicateBookingRequest) {
        if (duplicateBookingRequest.requestStatus == 'Request Denied') throw 'Error: Sorry, but the listing uploader has denied your request. Please request a booking for a different listing!'
        if (duplicateBookingRequest.requestStatus == 'Request Accepted') throw 'The owner of this listing has already accpeted your request! Head on over to the "Bookings" tab to view their contact information!'
        throw 'Error: You have already requested a booking for this listing! Please wait for the listing uploader to respond!'
    } 

    let newBookingRequest = {
        listingID: listingID,
        userRequestingBookingID: userRequestingBookingID,
        listingUploadedByID: listingUploadedByID,
        requestStatus: requestStatus
    }

    let insertInfoInBookingRequests = await bookingRequestsCollection.insertOne(newBookingRequest)
    if (!insertInfoInBookingRequests.acknowledged || !insertInfoInBookingRequests.insertedId) throw 'Error: Could not make Booking Request'
    
    let newBooking = {
        bookingRequestID: insertInfoInBookingRequests.insertedId.toString(),
        listingID: listingID,
        userRequestingBookingID: userRequestingBookingID,
        listingUploadedByID: listingUploadedByID,
        requestStatus: requestStatus
    }
    let insertInfoInMyBookings = await myBookingCollection.insertOne(newBooking)
    if (!insertInfoInMyBookings.acknowledged || !insertInfoInMyBookings.insertedId) throw 'Error: Could not add to listing owners Booking Request'

    return {insertedBookingRequestAndMyBooking: true} 
}

// export const deleteBooking = async (
//     bookingID
// )

// export const modifyBooking = async (
//     bookingID
// )


export const getBookingRequestsSent = async (id) => {
    id = helpers.checkId(id, 'User who requested a booking ID')
    let bookingRequestsCollection = await bookingRequests()
    let bookedRequests = await bookingRequestsCollection.find({userRequestingBookingID: id}).toArray()
    if (bookedRequests.length == 0) return 'No Booking Requests Sent'
    return bookedRequests
}


export const getBookingRequestsReceived = async (id) => {
    id = helpers.checkId(id, 'User who created a listing ID')
    let myBookingCollection = await myBookings()
    let bookingsReceived = await myBookingCollection.find({listingUploadedByID: id}).toArray()
    if (bookingsReceived.length == 0) return 'No Booking Requests Received'
    return bookingsReceived
}


export const respondToBookingRequestReceived = async (bookingID, response) => {
    bookingID = helpers.checkId(bookingID, 'Booking Request ID')
    response = helpers.checkString(response, 'Response')
    if (response == 'Accept') {response = 'Request Accepted'}
    else if (response == 'Deny') {response = 'Request Denied'}
    else {throw 'Error: Response can only be "Accept" or "Deny"'}

    let bookingRequestsCollection = await bookingRequests()
    let myBookingCollection = await myBookings()

    let bookingRecieved = await myBookingCollection.findOne({bookingRequestID: bookingID})
    
    let respondingToBookingRequest = await bookingRequestsCollection.findOneAndUpdate(
        {_id: new ObjectId(bookingID)},
        {$set: {requestStatus: response}}
    )
    let updatingMyBooking = await myBookingCollection.findOneAndUpdate(
        {_id: new ObjectId(bookingRecieved._id.toString())},
        {$set: {requestStatus: response}}
    )
    
    return {responseUpdated: true}
}


export const getContactInfoWhenBookingAccepted = async (listingUploadedByID) => {
    listingUploadedByID = helpers.checkId(listingUploadedByID)
    let userCollection = await users()
    let listingUploadedByInfo = await userCollection.findOne({_id: new ObjectId(listingUploadedByID)})
    let contactInfo = {phone: listingUploadedByInfo.phoneNumber, email: listingUploadedByInfo.emailAddress}
    return contactInfo
}