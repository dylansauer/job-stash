const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// static register method
userSchema.statics.register = async function (email, name, password) {
    // validation
    // Password needs at least one capital letter, one symbol, one number
    if (!email || !name || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, name, password: hash });

    return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect email or password");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
