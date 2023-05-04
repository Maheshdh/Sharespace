import { ObjectId } from "mongodb"
import { listings } from '../config/mongoCollections.js'
import { users } from "../config/mongoCollections.js"
import helpers from '../helpers.js'


export const addListingCommentOrQuestion = async (listingID, comment, madeByUserID, madeByFullName) => {
    listingID = helpers.checkId(listingID, 'Listing ID')
    comment = helpers.checkString(comment, 'Comment')
    madeByUserID = helpers.checkId(madeByUserID, 'User ID of commentor')
    madeByFullName = helpers.checkString(madeByFullName, 'Full Name of commentor')

    let newCommentToBeAdded = {
      comment: comment,
      madeByUserID: madeByUserID,
      madeByFullName: madeByFullName
    }

    let listingCollection = await listings()
    let listingInfo = await listingCollection.findOne({_id: new ObjectId(listingID)})
    let addingComment = await listingCollection.findOneAndUpdate(
      {_id: new ObjectId(listingID)},
      {$push: {comments: newCommentToBeAdded}}
      )
    
    return {commentAdded: true}
  }

// export const modifyListingCommentOrQuestoin = async(listingID, comment, madeByUserID) => {
//   let listingID = helpers.checkId(listingID, 'Listing ID')
//   let comment = helpers.checkString(comment, 'Comment')
//   let madeByUserID = helpers.checkId(madeByUserID, 'User ID of commentor')

//   let listingCollection = await listings()
//   let updatingCommentOrQuestion = listingCollection.findOneAndUpdate({})
// }