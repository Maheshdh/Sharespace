import express from 'express';
const app = express();
import session from 'express-session';
import exphbs from 'express-handlebars';
import configRoutes from './routes/index.js';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.static('public'));
app.use('/data/uploads', express.static('data/uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');


app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false
  })
);


// ---------------- Middlewares --------------------------

app.get('/', async (req, res) => {
 res.redirect('/landing')
})


app.use('/login', async (req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
      return res.redirect('/profile')
    }
})

app.use('/register', async (req, res, next) => {
  if (!req.session.user) {
    next()
  } else {
    return res.redirect('/login')
  }
})

app.use('/profile', async (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login')
  } else {
    next()
  }
})

app.use('/landing', async (req, res, next) => {
  return res.render('landing')
})

app.use('/listing/add', async (req, res, next) => {
  if (!req.session.user) {
    return res.render('login', {error: 'You need to be logged in to add a new listing!'})
  } else {
    next()
  }
})

app.use(async (req, res, next) => {
  let currentTimestamp = new Date().toUTCString()
  let requestMethod = req.method
  let requestRoute = req.originalUrl
  let authenticated = 'Non-Authenticated User'
  if (req.session.user) {
    authenticated = 'Authenticated User'
  }
  console.log(`[${currentTimestamp}]: ${requestMethod} ${requestRoute} (${authenticated})`)
  next() 
})

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
