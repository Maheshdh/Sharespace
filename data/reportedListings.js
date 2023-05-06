import { ObjectId } from "mongodb"
import { listings } from '../config/mongoCollections.js'
import { reports } from "../config/mongoCollections.js"
import helpers from '../helpers.js'
import { getListing } from "./listings.js"

export const makeNewReport = async (listingID, userID) => {
    if (!listingID || !userID) throw 'Error: Invalid number of parameters entered (Expected 2)'
    if (!listingID) throw 'Error: Listing ID missing'
    if (!userID) throw 'Error: User ID missing'

    listingID = helpers.checkId(listingID, 'Listing ID')
    userID = helpers.checkId(userID, 'User ID')

    let reportsCollection = await reports()


    let reportInfo = await reportsCollection.findOne({listingID: listingID})
    if (reportInfo) {
        let listingReportedByUsers = reportInfo.reportedBy
        if (listingReportedByUsers.includes(userID)) {
            throw 'Error: You have already reported this listing!'
        }
        let addingCount = await reportsCollection.findOneAndUpdate(
            {listingID: listingID},
            {$inc: {reportCount: 1}},
        )
        let addingUser = await reportsCollection.findOneAndUpdate(
            {listingID: listingID},
            {$push: {reportedBy: userID}}
        )
        return ({reported: true})
    }
    
    let newReport = {
        listingID: listingID,
        reportedBy: [userID],
        reportCount: 1
    }
    let addingNewReport = await reportsCollection.insertOne(newReport)
    if (!addingNewReport.acknowledged || !addingNewReport.insertedId) throw 'Error: Could not add listing' 

    return ({reported: true})
}


export const getAllReportedListings = async () => {
    let reportsCollection = await reports();

    let allReports = await reportsCollection.find({}).toArray()
    if (allReports.length > 1) {
        allReports.sort((a, b) => b.reportCount - a.reportCount)
    }

    let allReportsWithListingInfo = []
    if (allReports.length > 0) {
        for (let report of allReports) {
            let listingInfo = await getListing(report.listingID)
            allReportsWithListingInfo.push({
                listingInfo: listingInfo,
                reportedBy: report.reportedBy,
                reportCount: report.reportCount
            })
        }
    }

    return allReportsWithListingInfo
}


export const deleteReport = async (listingID) => {
    if (!listingID) throw 'Error: Missing Listing ID'
    listingID = helpers.checkId(listingID, 'Listing ID')

    let reportsCollection = await reports()

    const deletionInfo = await reportsCollection.findOneAndDelete({listingID: listingID});

    return {deleted: true};
}
    
    
    


