const express = require("express"),
    methodOveride = require("method-override"),
    productModel = require("../models/products"),
    commentModel = require("../models/comments"),
    middleware = require("../middleware/index"),
    router = express.Router();


router.get("/", (req, res) => {
    productModel.find({}, (err, allproducts) => {
        if (err) {
            // console.log(err);
            req.flash("error", "something went wrong");
            res.send('err');
        } else {
            res.render("products/products", {
                products: allproducts
            });
            // res.send("hellow");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render('products/new');
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    let newproduct = Object.assign(req.body.product);
    newproduct.author = author;
    console.log(newproduct);
    productModel.create(newproduct, (err, product) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            console.log(product);
            res.redirect("/products");
        }
    });
});

router.get("/:id", (req, res) => {
    productModel.findById(req.params.id).populate('comments').exec((err, product) => {
        if (err) {
            res.redirect("/products");
        } else {
            res.render("products/show", { product: product });
        }
    });
});

router.get("/:id/edit", middleware.checkproductsOwnership, (req, res) => {
    productModel.findById(req.params.id, (err, product) => {
        if (err) {
            res.redirect("/product");
        } else {
            res.render("products/edit", { product: product });
        }
    });
});

router.put("/:id", middleware.checkproductsOwnership, (req, res) => {
    productModel.findByIdAndUpdate(req.params.id, req.body.product, (err, product) => {
        if (err) {
            res.redirect("/products");
        } else {
            res.redirect("/products/" + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkproductsOwnership, (req, res) => {
    productModel.findById(req.params.id, (err, product) => {
        if (err) {
            res.redirect('back');
        } else {
            product.comments.forEach(element => {
                commentModel.findByIdAndRemove(element, (err) => {
                    if (err) {
                        console.log(err);
                        res.redirect('back');
                    }
                })
            });
        }
    });
    productModel.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/products");
        } else {
            res.redirect("/products");
        }
    });
});

module.exports = router;