const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const secret = require('../../config').secret;

const User = Schema({
    username: String,
    password: String,
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    collection: 'User'
});

// create new account
User.statics.create = function (username, password) {
    const encrypted = crypto.createHmac('sha1', secret)
        .update(password)
        .digest('base64');

    const user = new this({
        username,
        password: encrypted,
        posts: []
    })
    return user.save();
}

// find one user by username
User.statics.findOneByUsername = function (username) {
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

User.statics.getPostsById = function (_id) {

    return this.findOne({
        _id
    }).populate('posts',['title', 'content', 'createdAt', 'isSecret']).exec();
}
module.exports = mongoose.model('User', User);