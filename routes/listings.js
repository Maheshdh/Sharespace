import {Router} from 'express'
const router = Router()
import {getListing} from '../data/listings.js';
import {getUser} from '../data/users.js';
import helpers from '../helpers.js';

router
.route('/add')
.get(async(req,res) => {
    res.render('addListing')
})
.post(async(req,res)=>{
    const body = req.body;
})

router
  .route('/:id')
  .get(async (req,res) => {
      var id;
      console.log("Listing ID get")
      try {
          id = helpers.checkId(req.params.id);
      } catch (e) {
          console.log(e);
          res.status(400).render('error',{"error":e});
      }
      console.log(id);
      var listing;
      try {
          listing = await getListing(id);
        } catch (e) {
            console.log(e);
            res.status(404).render('error',{"error":e});
        }
        var user_id;
          try {
              user_id = helpers.checkId(listing.user_id);
          } catch (error) {
            console.log(error);
            res.status(400).render('errors',{"error":error});
          }
          try {
            const user = await getUser(user_id);
            res.status(200).render('listing',{"listing": listing,"user": user});
          } catch (error) {
              console.log(error)
              res.status(404).render('error',{"error":error});
          }

  })


export default router;