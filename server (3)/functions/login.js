'use strict'

const {User , validateUser} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (email , password) => {

    console.log(email , password);

    let currentUser = await User.findOne({email: email});

    const result = await bcrypt.compare(password , currentUser.password);

    if(result)
    {
        let details = {
            _id: currentUser._id,
            name: currentUser.name,
            socketId: currentUser.socketId,
            rooms: currentUser.rooms,
            conversations: currentUser.conversations,
            posts: currentUser.posts,
            likes: currentUser.likes,
            comments: currentUser.comments
        }
        currentUser.otp = null;
        await currentUser.save();
        return details;
    }
    else
    {
        return 'Invalid credentials';
    }

}