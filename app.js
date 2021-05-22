const express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    methodOveride = require("method-override"),
    path = require('path'),
    mongoose = require("mongoose");

const passport = require("passport"),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require("passport-local-mongoose");

const productModel = require("./models/products"),
    User = require('./models/User'),
    commentModel = require("./models/comments");

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/ASellingSite", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOveride('_method'));
app.set('views', path.join(__dirname, '/views'));

const productRoutes = require("./Routes/products");
const commentRoutes = require('./Routes/comments');
const indexRoutes = require('./Routes/index');


app.use(require('express-session')({
    secret: "Go ahead",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Use this currentuser for all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use('/products', productRoutes);
app.use('/products/:id/comments', commentRoutes);
app.use(indexRoutes);

app.listen(3000, () => {
    console.log("A selling is open");
});