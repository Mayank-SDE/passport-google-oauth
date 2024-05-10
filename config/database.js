const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGO_DB_URL);

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true
    },
    googleId: {
        type: String
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
