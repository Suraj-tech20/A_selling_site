const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/products');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
}), function() {});

router.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/products');
});

module.exports = router;