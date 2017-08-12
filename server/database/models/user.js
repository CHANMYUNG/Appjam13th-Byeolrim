const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const secret = require('../../config').secret;

let User = Schema({
    username: String,
    password: String,
}, {
    collection: 'user'
});

// create new account
User.statics.create = function (username, password) {
    console.log('User.create()');
    const encrypted = crypto.createHmac('sha1', secret)
        .update(password)
        .digest('base64');

    const user = new this({
        username,
        password: encrypted
    })
    console.log('User.create()');
    return user.save();
}

// find one user by username
User.statics.findOneByUsername = function (username) {
    console.log("findOneByUsername");
    console.log(username);
    return this.findOne({
        username
    }).exec()
}

// verify user 
User.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', secret)
        .update(password)
        .digest('base64');
    console.log(encrypted);
    return this.password === encrypted;
}

module.exports = mongoose.model('user', User);