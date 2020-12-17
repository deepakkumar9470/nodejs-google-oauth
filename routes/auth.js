const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importing Model
const User = require("../models/User");


//  AUth With Google
// @route GET /auth/google
router.get('/google',passport.authenticate('google', { scope: ['profile'] }))


// Google Auth callback
// @route GET /auth/google/callback
router.get('/google/callback',passport.authenticate('google', 
{ failureRedirect: '/login' }),
     (req, res) =>{
  // Successful authentication, redirect dashboard.
    res.redirect('/dashboard');
})


// Logout User
// @route GET /auth/logout
router.get('/logout', (req,res)=>{
  req.logOut()
  res.redirect('/')
})



module.exports = router