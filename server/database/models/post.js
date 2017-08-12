const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const secret = require('../../config').secret;
const Post = Schema({
    writer: { type : Schema.Types.ObjectId, ref : 'User', required : true },
    title : { type : String, required : true },
    content: { type : String, required : true },
    createdAt: { type : String, required : true },
    isSecret : { type : Boolean, required: true },
    key : { type : String }
    //images: [{ type : String}]
}, {
    collection: 'Post'
});

Post.statics.create = function (title, writer, content, createdAt, isSecret, key) {

    const encrypted = isSecret == 'true'? crypto.createHmac('sha1', secret)
        .update(key)
        .digest('base64') : undefined;
    const post = new this({
        title,
        writer,
        content,
        isSecret,
        createdAt,
        key : encrypted,
    })
    return post.save();
}

module.exports = mongoose.model('Post', Post);