const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [{ type: ObjectId, ref: "users" }],
    following: [{ type: ObjectId, ref: "users" }],
    photo: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
})


const userModel = mongoose.model("users", userSchema)


module.exports = userModel