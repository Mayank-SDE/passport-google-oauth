
const passport = require('passport');
const UserModel = require('./database');
const dotenv = require("dotenv").config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
},
    //we get these values after successfull authentication
    function (accessToken, refreshToken, profile, cb) {

        console.log(accessToken, profile);

        UserModel.findOne({ googleId: profile.id }).then((err, user) => {

            if (err) {
                return cb(err, null);
            }
            if (!user) {
                let newUser = new UserModel({
                    googleId: profile.id,
                    username: profile.displayName
                })

                newUser.save();

                return cb(null, newUser);
            } else {
                return cb(null, user);
            }



        });

        //Whenever the user getd authenticated google gives the accessTokens to your web application and 
        //then your app will verify that access token and gives the access to resources
        // when the accessToken gets expired , refreshToken is replaced with it

    }
));


//persist user data inside the session object
//store the user inside the session object.
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// it will fetch the user based on the id stored inside the session object 
//getting the session details
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
