

const {User , validateUser} = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (email , password,client) => {

    console.log(email , password);

   // let currentUser = await User.findOne({email: email});
   const currentUser=await client.query('select * from users where email=$1',[email])

   if((currentUser.rows).length===0)
   return 'not registered'

   if((currentUser.rows[0]).otp!==null)
   return 'otp not null'

   console.log(currentUser.rows[0])

    const result = await bcrypt.compare(password , (currentUser.rows[0]).password);

    if(result)
    {
        
        return currentUser.rows[0];
    }
    else
    {
        return 'Invalid credentials';
    }

}