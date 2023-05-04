const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const app = express();


app.use(express.json())
app.use(cors())


require('./db/config')
const userModel = require('./models/user')
const postModel = require('./models/post')
const requireLogin = require("./middleware/requireLogin")
const { JWT_SECRET } = require('./keys/keys')


// REGISTER API

app.post('/register', (req, res) => {
    const { name, mail, password, photo } = req.body
    if (!name || !mail || !password) {
        return res.status(422).json({
            Error: "Enter all fields."
        })
    }
    userModel.findOne({ mail }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({
                Error: "User already exists."
            })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new userModel({
                name,
                mail,
                password: hashedPassword,
                photo
            })
            user.save().then((user) => {
                res.json({ Message: "Signed in 🌈" })
            }).catch((err) => {
                console.log(err)
            })
        })
    }).catch((err) => {
        console.log(err)
    })
})


// LOGIN API

app.post('/login', (req, res) => {
    const { mail, password } = req.body
    if (!mail || !password) {
        res.status(422).json({
            Error: "Enter all fields."
        })
    }
    userModel.findOne({ mail }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ Error: "Invalid mail and password." })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, mail, followers, following, photo } = savedUser
                res.json({ token, user: { _id, name, mail, followers, following, photo } })
            } else {
                return res.status(422).json({ Error: "Invalid mail and password." })
            }
        }).catch((err) => {
            console.log(err)
        })
    }).catch((err) => {
        console.log(err)
    })
})


// CREATE POST API

app.post('/createpost', requireLogin, (req, res) => {
    const { title, body, photo } = req.body
    if (!title || !body || !photo) {
        return res.status(422).json({ Error: "Enter all fields." })
    }
    req.user.password = undefined
    const post = new postModel({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then((post) => {
        res.status(200).json({ post })
    }).catch((err) => {
        console.log(err)
    })
})


// ALL POST API

app.get('/allpost', requireLogin, (_, res) => {
    postModel.find()
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .then((posts) => {
            res.status(200).json({ posts })
        }).catch((err) => {
            console.log(err)
        })
})


// MY POST API

app.get('/mypost', requireLogin, (req, res) => {
    postModel.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then((posts) => {
            res.status(200).json({ posts })
        }).catch((err) => {
            console.log(err)
        })
})


// LIKE API

app.put('/like', requireLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            res.status(422).json(err)
        })
})


// UNLIKE API

app.put('/unlike', requireLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    }).then(result => {
        return res.status(200).json(result)
    })
        .catch(err => {
            res.status(422).json(err)
        })
})

// COMMENTS API

app.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    postModel.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name")
        .populate("postedBy", "_id name")
        .then(result => {
            return res.status(200).json(result)
        })
        .catch(err => {
            res.status(422).json(err)
        })
})


// DELETE API

app.delete('/deletepost/:postId', requireLogin, (req, res) => {
    postModel.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .then((post) => {
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.deleteOne()
                    .then(result => {
                        res.json(result)
                    }).catch(err => {
                        console.log(err)
                    })
            }
        })
})


// SEE POST OF OTHER USER'S API

app.get('/user/:id', requireLogin, (req, res) => {
    userModel.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            postModel.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .then((posts) => {
                    res.json({ user, posts })
                }).catch(err => {
                    return res.status(422).json({ Error: err })
                })
        }).catch(err => {
            return res.status(404).json({ Error: "User not found." })
        })
})

// FOLLOW API

app.put('/follow', requireLogin, (req, res) => {
    userModel.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }).then(result => {
        userModel.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }

        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            res.status(422).json({ Error: err })
        })
    }).catch(err => {
        res.status(422).json({ Error: err })
    })
})


// UNFOLLOW API

app.put('/unfollow', requireLogin, (req, res) => {
    userModel.findByIdAndUpdate(req.body.followId, {
        $pull: { followers: req.user._id }
    }, {
        new: true
    }).then(result => {
        userModel.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }

        }, { new: true }).select("-password").then(result => {
            res.json(result)
        }).catch(err => {
            res.status(422).json({ Error: err })
        })
    }).catch(err => {
        res.status(422).json({ Error: err })
    })
})


// UPDATE PROFILE PICTURE

app.put('/updatepic', requireLogin, (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, { $set: { photo: req.body.photo } }, {
        new: true
    }).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        res.status(422).json({ Error: err })
    })
})

app.listen(5000)