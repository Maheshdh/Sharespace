import { ObjectId } from "mongodb"
import {users} from '../config/mongoCollections.js'
import helpers from '../helpers.js'
import bcrypt from 'bcrypt'

export const createUser = async (
    firstName,
    lastName,
    emailAddress,
    password,
    phoneNumber
  ) => {
    if (!firstName || !lastName || !emailAddress || !password || !phoneNumber) throw 'Error: Invalid number of parameters entered (Expected 5)'
    if (!firstName) throw 'Error: "firstName" parameter not entered'
    if (!lastName) throw 'Error: "lastName" parameter not entered'
    if (!emailAddress) throw 'Error: "emailAddress" parameter not entered'
    if (!password) throw 'Error: "password" parameter not entered'
    if (!phoneNumber) throw 'Error: "phoneNumber" parameter not entered'
   
    let userCollection = await users()
  
    firstName = helpers.checkString(firstName, 'First Name')
    lastName = helpers.checkString(lastName, 'Last Name')
    emailAddress = helpers.checkEmail(emailAddress, 'Email Address')
    password = helpers.checkPassword(password, 'Password')
    phoneNumber = helpers.checkPhoneNumber(phoneNumber, 'Phone Number')
    let role = 'user'
    let hashedPassword = await bcrypt.hash(password, 10)
    
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      rating: 0,
      role: role
    }
    
    let insertInfo = await userCollection.insertOne(newUser)
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error: Could not add User' 
    return {insertedUser: true}
  };
  
  
export const checkUser = async (emailAddress, password) => {
    if (!emailAddress || !password) throw 'Error: invalid number of parameters entered (2 expected)'
    if (!emailAddress) throw 'Error: parameter "emailAddress" is missing'
    if (!password) throw 'Error: parameter "password" is missing'

    let userCollection = await users()

    emailAddress = helpers.checkEmail(emailAddress, 'Email Address')
    password = helpers.checkPassword(password, 'Password')
   
    let currentUser = await userCollection.findOne({emailAddress: emailAddress}) 
    let currentUserInfo = {
      firstName: currentUser.firstName, 
      lastName: currentUser.lastName,
      emailAddress: currentUser.emailAddress,
      phoneNumber: currentUser.phoneNumber,
      rating: currentUser.rating,
      role: currentUser.role
    }
    if (!currentUser) throw 'Error: Either the email address or password is invalid'
    else {
      if (await bcrypt.compare(password, currentUser.password)) return (currentUserInfo)
      else throw `Error: Either the email address or password is invalid`
    }
  };
  export const getUser = async (id) => {
    id = helpers.checkId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if(!user) throw "The user is not found";
    return user;
  };