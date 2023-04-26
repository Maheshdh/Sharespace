
import userRoutes from './users.js'
import listingRoutes from './listings.js'
import bookingRoutes from './bookings.js'
import landingRoutes from './landing.js'
import authRoutes from './authRoutes.js'

const constructMethod = (app) => {
    app.use('/', authRoutes)

    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
      });
}

export default constructMethod