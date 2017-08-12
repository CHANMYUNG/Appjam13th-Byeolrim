const User = require('../../../database/models/user')
const Post = require('../../../database/models/post')
const crypto = require('crypto');
const secret = require('../../../config').secret;
exports.getPosts = (req, res) => {
    const _id = req.decoded._id;

    const respond = (user) => {
        res.status(200).json(user.posts);
    }

    const onError = (error) => {
        res.status(500).json({
            message: error.message
        });
    }

    User.getPostsById(_id).then(respond).catch(onError);
}

exports.createPost = (req, res) => {
    const writer = req.decoded._id;
    const {
        title,
        createdAt,
        content,
        isSecret
    } = req.body;

    const addPostToWriter = (post) => {
        User.findById(writer, function (err, user) {
            if (err) throw new Error('server error occurred');
            else {
                user.posts.push(post._id);
                return user.save();
            }
        });
    }

    const respond = (user) => {
        res.sendStatus(201);
    }

    const onError = (error) => {
        res.status(400).json({
            message: error.message
        });
    }

    Post.create(title, writer, content, createdAt, isSecret, isSecret == 'true' ? req.body.key : undefined)
        .then(addPostToWriter)
        .then(respond)
        .catch(onError);
}

exports.modifyPost = (req, res) => {

    const pid = req.params.pid;
    const writer = req.decoded._id;

    const modify = (post) => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.isSecret = req.body.isSecret;
        post.key = req.body.isSecret == 'true' ? crypto.createHmac('sha1', secret)
            .update(req.body.key)
            .digest('base64') : undefined;
        return post.save();
    }

    const respond = (post) => {
        res.sendStatus(200);
    }

    const onError = (error) => {
        res.status(400).json({
            message: error.message
        });
    }

    Post.findOne({
            "_id": pid,
            "writer": writer
        }).then(modify)
        .then(respond)
        .catch(onError);
}

exports.deletePost = (req, res) => {
    const pid = req.params.pid;
    const writer = req.decoded._id;
    const respond = (post) => {
        res.sendStatus(200);
    }

    const onError = (error) => {
        res.status(409).json({
            message: error.message
        });
    }

    const rmPostFromWriter = (post) => {
        User.findById({
            "_id": writer
        }, function (err, user) {
            if(err) throw new Error('Failed to search writer');
            else {
                user.posts.remove(post._id);
                return user.save();
            }
        })
    }

    Post.findOneAndRemove({
        "_id": pid,
        "writer": writer
    }).then(rmPostFromWriter).then(respond).catch(onError);


}

Array.prototype.remove = function (value) {
    if (this.indexOf(value) != -1) { // Make sure the value exists
        this.splice(this.indexOf(value), 1);
    }
}