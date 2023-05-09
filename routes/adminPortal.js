import {Router} from 'express'
const router = Router()

import helpers from '../helpers.js'
import { deleteListing} from '../data/listings.js'
import xss from 'xss';
import { getAllReportedListings, deleteReport } from '../data/reportedListings.js'

router
.route('/')
.get(async (req, res) => {
    try {
        let currentUser = req.session.user
        if (!currentUser) throw 'Please log in to view this page'
        if (currentUser.role != 'admin') throw 'You are not allowed to view this page as you do not have valid permissions'
        
        let noReportedListings = false
        let reportedListings = await getAllReportedListings()
        if (reportedListings.length == 0) {
            noReportedListings = true
        }
        return res.render('adminPortal', {reportedListings: reportedListings, noReportedListings: noReportedListings})
    } catch (e) {
        return res.render('errors', {error:e})
    }
})

router
.route('/delete/:id')
.post(async (req, res) => {
    try {
        let currentUser = req.session.user
        if (!currentUser) throw 'Please log in to view this page'
        if (currentUser.role != 'admin') throw 'You are not allowed to view this page as you do not have valid permissions'
        
        let userInput = req.body
        applyXSS(req.body);
        let listingID = req.params.id.toString()
        if (!listingID) throw 'Error: Listing ID is missing'
        let listingToBeDeletedID = helpers.checkId(listingID, 'Listing ID')

        let currentUserID = req.session.user.userID
        currentUserID = helpers.checkId(currentUserID, 'User ID')
        
        let deletingListing = await deleteListing(listingToBeDeletedID, currentUserID)

        if (deletingListing.deleted == true) {
            res.redirect('/adminPortal')
        } else {
            res.status(500).render('errors', {error:'Internal Server Error'})
        }
    } catch (e) {
        return res.render('errors', {error:e})
    }
})


router 
.route('/ignore/:id')
.post(async (req, res) => {
    try {
        let currentUser = req.session.user
        if (!currentUser) throw 'Please log in to view this page'
        if (currentUser.role != 'admin') throw 'You are not allowed to view this page as you do not have valid permissions'
        
        let userInput = req.body
        applyXSS(req.body)
        let listingID = req.params.id.toString()
        if (!listingID) throw 'Error: Listing ID is missing'
        let reportToBeIgnoredListingID = helpers.checkId(listingID, 'Listing ID')

        let deletingReport = await deleteReport(reportToBeIgnoredListingID)

        if (deletingReport.deleted == true) {
            res.redirect('/adminPortal')
        } else {
            res.status(500).render('errors', {error:'Internal Server Error'})
        }
    } catch (e) {
        return res.render('errors', {error:e})
    }
})

const applyXSS = (req_body) => {
    Object.keys(req_body).forEach(function (key, index) {
      req_body[key] = xss(req_body[key]);
    });
  };

export default router;