import fs from 'fs';
import { MongoClient } from 'mongodb';
import { ObjectId } from "mongodb";


const url = 'mongodb://127.0.0.1:27017/'
const dbName = 'CS546-Project-Group35'

const client = new MongoClient(url)

const users = fs.readFileSync('./seed_data/users.json');
const usersData = JSON.parse(users);
for (let data of usersData) {
    data._id = new ObjectId(data._id.$oid)
}

const reviews = fs.readFileSync('./seed_data/reviews.json')
const reviewsData = JSON.parse(reviews);
for (let data of reviewsData) {
    data._id = new ObjectId(data._id.$oid)
}

const reports = fs.readFileSync('./seed_data/reports.json')
const reportsData = JSON.parse(reports);
for (let data of reportsData) {
    data._id = new ObjectId(data._id.$oid)
}

const myBookings = fs.readFileSync('./seed_data/myBookings.json')
const myBookingsData = JSON.parse(myBookings);
for (let data of myBookingsData) {
    data._id = new ObjectId(data._id.$oid)
}

const messages = fs.readFileSync('./seed_data/messages.json')
const messagesData = JSON.parse(messages);
for (let data of messagesData) {
    data._id = new ObjectId(data._id.$oid)
}

const listings = fs.readFileSync('./seed_data/listings.json')
const listingsData = JSON.parse(listings);
for (let data of listingsData) {
    data._id = new ObjectId(data._id.$oid)
}

const bookingRequests = fs.readFileSync('./seed_data/bookingRequests.json')
const bookingRequestsData = JSON.parse(bookingRequests);
for (let data of bookingRequestsData) {
    data._id = new ObjectId(data._id.$oid)
}



async function seedCollection(collectionName, data) {
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      await collection.insertMany(data);
      console.log(`Seeding collection '${collectionName}' completed!`);
    } catch (error) {
      console.error(`Error seeding '${collectionName}' ; Error: ${error}`);
    } finally {
      client.close();
    }
  }

  
seedCollection('users', usersData); 
seedCollection('reviews', reviewsData); 
seedCollection('reports', reportsData); 
seedCollection('myBookings', myBookingsData); 
seedCollection('messages', messagesData); 
seedCollection('listings', listingsData); 
seedCollection('bookingRequests', bookingRequestsData); 
