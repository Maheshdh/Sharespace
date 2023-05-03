import {Router} from 'express';
const router = Router();
import { countListings } from '../data/listings.js';
import { countUsers } from '../data/users.js'

router
.route('/')
.get(async (req, res) => {
  let totalListings = await countListings()
  let totalUsers = await countUsers()
  let message = ''
  // let totalListings = 1
  // let totalUsers = 2
  if (totalUsers == 0 && totalListings == 0) {
    message = "Register to be our first user and upload our first listing!!!"
    return res.render("landing", {"message": message})
  } else if (totalUsers > 1 && totalListings > 1) {
      message = `We have ${totalListings} listings and ${totalUsers} unique users!`
      return res.render("landing", {"message": message})
    } else if (totalUsers > 1 && totalListings <= 1) {
      message = `We have ${totalListings} listing and ${totalUsers} unique users!`
      return res.render("landing", {"message": message})
    } else if (totalUsers <= 1 && totalListings > 1) {
      message = `We have ${totalListings} listings and ${totalUsers} unique user!`
      return res.render("landing", {"message": message})
    } else {
      message = `We have ${totalListings} listing and ${totalUsers} unique user!`
      return res.render("landing", {"message": message})
    }
  // I can see your judgy eyes through the screen, I wrote this code at 5 am so give me a break, ok? ok :D
});


export default router;
