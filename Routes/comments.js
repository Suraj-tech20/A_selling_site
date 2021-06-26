const commentModel = require("../models/comments"),
    productModel = require("../models/products"),
    express = require("express"),
    middleware = require('../middleware/index'),
    router = express.Router({ mergeParams: true });

router.get("/new", middleware.isLoggedIn, (req, res) => {
    productModel.findById(req.params.id, function(err, product) {
        if (err) {
            // console.log("err");
            req.flash("error", "Something is went wrong");
            res.redirect("/products");
        } else {
            res.render('comments/new', { product: product });
        }
    });
});

router.post('/', middleware.isLoggedIn, (req, res) => {
    productModel.findById(req.params.id, function(err, product) {
        if (err) {
            // console.log('err');
            req.flash("error", "Product does not exits");
            res.redirect('/products');
        } else {
            const author = {
                id: req.user._id,
                username: req.user.username
            }
            let newcomment = {};
            newcomment = Object.assign(req.body.comment);
            newcomment.author = author;
            commentModel.create(newcomment, (err, comment) => {
                if (err) {
                    // console.log(err);
                    req.flash("error", "Something is went wrong");
                    res.redirect("/products");
                } else {
                    comment.save();
                    product.comments.push(comment);
                    product.save();
                    req.flash("success", "Comment is added");
                    res.redirect('/products/' + req.params.id);
                }
            });
        }
    });
});

router.get('/:_id/edit', middleware.checkcommentOwnership, (req, res) => {
    commentModel.findById(req.params._id, function(err, comment) {
        if (err) {
            req.flash("error", "comment does not exits");
            res.redirect('/product');
        } else {
            res.render("comments/edit", { comment: comment, id: req.params.id });
        }
    });
});

router.put('/:_id', middleware.checkcommentOwnership, (req, res) => {
    commentModel.findByIdAndUpdate(req.params._id, req.body.comment, function(err, comment) {
        if (err) {
            // console.log(err);
            res.redirect("/products/" + req.params.id + "/edit");
        } else {
            req.flash("success", "Successfully editted the comment");
            res.redirect("/products/" + req.params.id);
        }
    });
});

router.delete('/:_id', middleware.checkcommentOwnership, (req, res) => {
    commentModel.findByIdAndRemove(req.params._id, function(err) {
        if (err) {
            // console.log(err);
            req.flash("error", "comment does not exits");
            res.redirect('back');
        } else {
            req.flash("success", "Successfully deleted the comment");
            res.redirect('/products/' + req.params.id);
        }
    });
});

module.exports = router;