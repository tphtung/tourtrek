const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.use('/save-referer', authController.saveReferer);

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }), authController.googleRedirect);

router.get('/logout', authController.logout);

module.exports = router;
