const Patient = require('../models/Patient');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config();
var express = require('express');
var router = express.Router();

var app = express();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('<a href="/auth/google"> Authenticate using google</a>');
});
const jwt = require('jsonwebtoken');
const maxAge=15*60

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role:user.role
    // Ajoutez d'autres propriétés que vous souhaitez inclure dans le token
  };
  const secret = 'my_secret_key'; // Remplacez par votre propre clé secrète
  const options = { expiresIn: '30m' }; // Définissez la durée de vie du token

  return jwt.sign(payload, secret, options);
};

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true
},
  function (request, accessToken, refreshToken, profile, done) {
    // Retrieve user's profile information
    const { sub, name, given_name, family_name, email } = profile;

    // Check if user already exists in database
    Patient.findOne({ email: email,confirmed:true })
      .then((user) => {
        if (user) {
          // If user already exists, generate and return JWT token
          const token = generateToken(user);
          console.log(token);
          return done(null, { user: profile, token });
        }
        else {
          // If user does not exist, return error response
          return done(null, false, { message: "User not found" })
        }
      })
      .catch((err) => {
        return done(err);
      });
  }
));
// Authentication route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after successful authentication
router.get('/auth/google/callback',
passport.authenticate('google', { failureRedirect: 'http://localhost:3000/ErrorSignInPage' }),
function(req, res) {
  // Successful authentication, redirect to profile page
  const token = req.user.token;
  res.cookie('jwt', token, { maxAge: maxAge*1000 });
 
  res.redirect('http://localhost:3000/')
  
});


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.post('/homeReload', (req, res) => {
  // Your server-side code here
  res.redirect('http://localhost:3000/');
});

module.exports = router;