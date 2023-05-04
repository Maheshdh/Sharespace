import {Router} from 'express';
const router = Router();
import { countListings , getAllListings } from '../data/listings.js';
import { countUsers } from '../data/users.js'

router
.route('/')
.get(async (req, res) => {
  let totalListings = await countListings()
  let totalUsers = await countUsers()
  let message = ''
  let allListings = await getAllListings()

  // let totalListings = 1
  // let totalUsers = 2
  if (totalUsers == 0 && totalListings == 0) {
    message = "Register to be our first user and upload our first listing!!!"
  } else if (totalUsers > 1 && totalListings > 1) {
      message = `We have ${totalListings} listings and ${totalUsers} unique users!`
    } else if (totalUsers > 1 && totalListings <= 1) {
      message = `We have ${totalListings} listing and ${totalUsers} unique users!`
    } else if (totalUsers <= 1 && totalListings > 1) {
      message = `We have ${totalListings} listings and ${totalUsers} unique user!`
    } else {
      message = `We have ${totalListings} listing and ${totalUsers} unique user!`
    }
  // I can see your judgy eyes through the screen, I wrote this code at 5 am so give me a break, ok? ok :D
  return res.render("landing", {"message": message, "listings":allListings})

});


export default router;
