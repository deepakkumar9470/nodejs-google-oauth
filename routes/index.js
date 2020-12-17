const express = require("express");
const router = express.Router();

// Importing Middleware
const {ensureAuth,ensureGuest} = require('../middleware/auth')

// Importing Model
const Story = require("../models/Story");

// Login /Landing page
// @route GET /
router.get('/',ensureGuest, (req, res)=>{
    res.render('login_main',{
        layout: 'login',
    })
})

// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res)=>{
     try {
          const stories = await Story.find({user : req.user.id}).lean()
          res.render('dashboard',{
              name : req.user.firstName,
              stories
          })
     } catch (error) {
         console.error(error)
         res.render('error/500')
     }

})


module.exports = router