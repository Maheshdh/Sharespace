
import userRoutes from './users.js'
import listingRoutes from './listings.js'
import homePageRoutes from './homepage.js'
import bookingRoutes from './bookings.js'
import landingRoutes from './landing.js'
import authRoutes from './authRoutes.js'
import profileRoutes from './profile.js'
import adminPortalRoutes from './adminPortal.js'
import messageRoutes from './messages.js'

const constructMethod = (app) => {
    app.use('/', authRoutes)
    app.use('/landing', landingRoutes)
    app.use('/homepage', homePageRoutes)
    app.use('/profile', profileRoutes)
    app.use('/bookings', bookingRoutes)
    app.use('/listing',listingRoutes)
    app.use('/users', userRoutes)
    app.use('/adminPortal', adminPortalRoutes)
    app.use('/message', messageRoutes)

    app.use('*', (req, res) => {
      return res.render('errors', {error:'404: That Page Does not Exist'});
      });
} 

export default constructMethod