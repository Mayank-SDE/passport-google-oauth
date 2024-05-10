const express = require("express");
const UserModel = require("./config/database");
const bcrypt = require("bcrypt");
const session = require("express-session");
const dotenv = require("dotenv").config();
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./config/passport");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL, collectionName: "sessions" }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
app.use(passport.initialize());
app.use(passport.session());


// This middleware will the request from upcoming form to the format we need.


app.post('/login', passport.authenticate('local', { successRedirect: '/protected' }));


app.get("/login", (request, response) => {
    response.render("login");
});





app.get("/", (request, response) => {
    return response.status(200).json({
        success: true,
        message: "Hello mate."
    })
})



app.post("/login", passport.authenticate("local", {
    successRedirect: '/protected'
}))


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', successRedirect: "/protected" }));

app.get("/logout", (request, response) => {

    request.logout(() => {
        response.redirect("/login");

    });
})

app.get("/protected", (request, response) => {

    console.log(request.user);
    console.log(request.session);

    if (request.isAuthenticated()) {
        console.log("rendered");
        response.render("protected", {
            name: request.user.name
        });
    } else {
        return response.status(401).json({
            success: false,
            message: "Not authorized"
        })

    }

})

const PORT = 8000;

app.listen(PORT, (requset, response) => {
    console.log(`Server is running on the PORT ${PORT}`);
});