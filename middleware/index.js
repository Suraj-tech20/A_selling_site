const comment = require('../models/comments');
const products = require('../models/products');

const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login");
    res.redirect('/login');
}

middlewareObj.checkcommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params._id, (err, foundcomment) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            } else {
                if (foundcomment.author.id.equals(req.user._id))
                    next();
                else {
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "Please Login")
        res.redirect('/login');
    }
}

middlewareObj.checkproductsOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        products.findById(req.params.id, (err, product) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            } else {
                if (product.author.id.equals(req.user._id))
                    next();
                else {
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "Please Login")
        res.redirect('/login');
    }
}

module.exports = middlewareObj;