const User = require('../models/user');


exports.getUsers = async(req) => {

    let users = await User.find({_id: { $in: req.body.users}}).select({ _id: 1 , name: 1});

    return users;
    
}