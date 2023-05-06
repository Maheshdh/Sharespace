
import userRoutes from './users.js'
import listingRoutes from './listings.js'
import homePageRoutes from './homepage.js'
import bookingRoutes from './bookings.js'
import landingRoutes from './landing.js'
import authRoutes from './authRoutes.js'
import profileRoutes from './profile.js'
import adminPortalRoutes from './adminPortal.js'

const constructMethod = (app) => {
    app.use('/', authRoutes)
    app.use('/landing', landingRoutes)
    app.use('/homepage', homePageRoutes)
    app.use('/profile', profileRoutes)
    app.use('/bookings', bookingRoutes)
    console.log("Index");
    app.use('/listing',listingRoutes)
    app.use('/users', userRoutes)
    app.use('/adminPortal', adminPortalRoutes)

    app.use('*', (req, res) => {
        res.render('errors', {error:'404: That Page Does not Exist'});
      });
} 

export default constructMethod