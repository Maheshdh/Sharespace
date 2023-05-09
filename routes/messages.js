import {Router} from 'express'
const router = Router()
import helpers from '../helpers.js';
import {getUser} from '../data/users.js';
import { getMessages, newMessage, replyMessage } from '../data/messages.js';


router 
.route('/newMessage/:id')
.get(async (req, res) => {
    try {
        if (!req.session.user) throw 'Error: You need to be logged in send messages'
        let userID = helpers.checkId(req.session.user.userID, 'User ID')
        let messageToID = helpers.checkId(req.params.id, 'Sending Message to User ID')
        if (userID == messageToID) throw 'Error: You cannot send a message to yourself!'

        let messageToInfo = await getUser(messageToID)
        let messageToName = messageToInfo.firstName + ' ' + messageToInfo.lastName
        return res.render('newMessage', {messageTo: {id: messageToID, name: messageToName}})
    } catch (e) {
        return res.render('errors', {error:e})
    }
})
.post(async (req, res) => {
    try {
        if (!req.session.user) throw 'Error: You need to be logged in send messages'
        let userID = helpers.checkId(req.session.user.userID, 'User ID')
        let messageToID = helpers.checkId(req.params.id, 'Sending Message to User ID')
        if (userID == messageToID) throw 'Error: You cannot send a message to yourself!'

        let userInput = req.body
        if (!userInput.new_messageInput) throw 'Error: Missing message content'
        let message = helpers.checkString(userInput.new_messageInput, 'Message Content')
        
        let sendingMessage = await newMessage(userID, messageToID, message)
        if (sendingMessage.sent == true) {
            return res.render('messageSent')
        } else {
            return res.render('errors', {error: 'Your message was not sent, please try again'})
        }
    } catch (e) {
        return res.render('errors', {error: e})
    }
})


router
.route('/myMessages')
.get(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.render('login', {error: 'Error: You need to be logged in view your messages!'})
        }
        let userID = helpers.checkId(req.session.user.userID, 'User ID')

        let allMessages = await getMessages(userID)
        return res.render('myMessages', {allMessages: allMessages})
    } catch (e) {
        return res.render('errors', {error:e})
    }
})


export default router;