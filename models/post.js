const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'users'
    },
    likes: [{
        type: ObjectId,
        ref: 'users'
    }],
    comments: [{
        text: String,
        postedBy: {
            type: ObjectId,
            ref: 'users'
        }
    }]
})


const postModel = mongoose.model("posts", postSchema)


module.exports = postModel