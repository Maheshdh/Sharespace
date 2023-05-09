import { ObjectId } from "mongodb"
import { listings } from "../config/mongoCollections.js"
import { users } from "../config/mongoCollections.js"
import { messages } from "../config/mongoCollections.js"
import helpers from '../helpers.js'


export const newMessage = async (messageFromID, messageToID, message) => {
    if (!messageFromID || !messageToID || !message) throw 'Error: Invalid number of parameters entered (Expected 3)'
    if (!messageFromID) throw 'Error: Missing user ID of message sender'
    if (!messageToID) throw 'Error: Missing user ID of message reciever'
    if (!message) throw 'Error: Missing message content'

    messageFromID = helpers.checkId(messageFromID, 'Message Sender ID')
    messageToID = helpers.checkId(messageToID, 'Message reciever ID')
    message = helpers.checkMessage(message, 'Message Content')

    if (messageFromID == messageToID) throw 'Error: You cannot send a message to yourself!'

    let userCollection = await users()
    let messageCollection = await messages()

    let messageFromInfo = await userCollection.findOne({_id: new ObjectId(messageFromID)})
    let messageToInfo = await userCollection.findOne({_id: new ObjectId(messageToID)})
    let messageFromName = messageFromInfo.firstName + ' ' + messageFromInfo.lastName
    let messageToName = messageToInfo.firstName + ' ' + messageToInfo.lastName

    let findingDuplicate1 = await messageCollection.findOne(
        {$and: [
            {"user1.id": messageFromID},
            {"user2.id": messageToID}
        ]}
    )
    let findingDuplicate2 = await messageCollection.findOne(
        {$and: [
            {"user2.id": messageFromID},
            {"user1.id": messageToID}
        ]}
    )
    if (findingDuplicate1 || findingDuplicate2) {
        let reply = replyMessage(messageFromID, messageToID, message)
        return reply
    }

    let newMessageObject = {
        user1: {id: messageFromID,
                name: messageFromName},
        user2: {id: messageToID, 
                name: messageToName},
        content: [{
            message: message,
            sentByID: {id: messageFromID, name: messageFromName}
        }]
    }

    let addingMessage = await messageCollection.insertOne(newMessageObject)
    if (!addingMessage.acknowledged || !addingMessage.insertedId) throw 'Error: Could not send message'

    return {sent: true}
}


export const replyMessage = async (messageFromID, messageToID, message) => {
    if (!messageFromID || !messageToID || !message) throw 'Error: Invalid number of parameters entered (Expected 3)'
    if (!messageFromID) throw 'Error: Missing user ID of message sender'
    if (!messageToID) throw 'Error: Missing user ID of message reciever'
    if (!message) throw 'Error: Missing message content'

    messageFromID = helpers.checkId(messageFromID, 'Message Sender ID')
    messageToID = helpers.checkId(messageToID, 'Message reciever ID')
    message = helpers.checkMessage(message, 'Message Content')

    if (messageFromID == messageToID) throw 'Error: You cannot send a message to yourself!'

    let userCollection = await users()
    let messageCollection = await messages()

    let messageFromInfo = await userCollection.findOne({_id: new ObjectId(messageFromID)})
    let messageToInfo = await userCollection.findOne({_id: new ObjectId(messageToID)})
    let messageFromName = messageFromInfo.firstName + ' ' + messageFromInfo.lastName
    let messageToName = messageToInfo.firstName + ' ' + messageToInfo.lastName

    let findingDuplicate1 = await messageCollection.findOne(
        {$and: [
            {"user1.id": messageFromID},
            {"user2.id": messageToID}
        ]}
    )
    let findingDuplicate2 = await messageCollection.findOne(
        {$and: [
            {"user2.id": messageFromID},
            {"user1.id": messageToID}
        ]}
    )
    if (!findingDuplicate1 && !findingDuplicate2) {
        throw 'Error: Could not find previous chat history. Please send the user a new message by going to one of their listings'
    }

    if (findingDuplicate1) {
        let newReplyContent = {message: message, sentByID: {id: messageFromID, name: messageFromName}}
        let replying = await messageCollection.findOneAndUpdate(        
            {$and: [
                {"user1.id": messageFromID},
                {"user2.id": messageToID}
                ]
            },
            {$push: {content: newReplyContent}}
        )
        return {sent: true}
    } else if (findingDuplicate2) {
        let newReplyContent = {message: message, sentByID: {id: messageFromID, name: messageFromName}}
        let replying = await messageCollection.findOneAndUpdate(        
            {$and: [
                {"user2.id": messageFromID},
                {"user1.id": messageToID}
                ]
            },
            {$push: {content: newReplyContent}}
        )
        return {sent: true}
    }

    return {sent: false}
}


export const getMessages = async (userID) => {
    if (!userID) throw 'Error: userID not provided'

    userID = helpers.checkId(userID, 'User ID')

    let userCollection = await users()
    let messageCollection = await messages()

    let userInfo = await userCollection.findOne({_id: new ObjectId(userID)})
    let userName = userInfo.firstName + ' ' + userInfo.lastName
    
    let findMessagesWhenSenderIsUser = await messageCollection.find({"user1.id" : userID}).toArray()
    let findMessagesWhenReceiverIsUser = await messageCollection.find({"user2.id" : userID}).toArray()

    let displayMessagesObject = [] 
    // Array of objects containing messages where each message: 
    // { chatWith: {id: userID, name: userName}, 
    //   content: { message: message, 
    //              sentByID: {id: messageFromID, name: messageFromName}
    //            }
    // }

    if (!findMessagesWhenSenderIsUser || !findMessagesWhenReceiverIsUser) {
        return displayMessagesObject
    }

    if (findMessagesWhenSenderIsUser) {
        for (let message of findMessagesWhenSenderIsUser) {
            let messageObject = {
                chatWith: message.user2,
                content: message.content
            }
            displayMessagesObject.push(messageObject)
        }
    }
    if (findMessagesWhenReceiverIsUser) {
        for (let message of findMessagesWhenReceiverIsUser) {
            let messageObject = {
                chatWith: message.user1,
                content: message.content
            }
            displayMessagesObject.push(messageObject)
        }
    }

    return displayMessagesObject 
}


